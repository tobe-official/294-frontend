package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// --- Migration 1: Add "credits" field + enforce auth rules on users ---
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// 1a) Add the "credits" field (integer, required)
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"hidden": false,
			"id": "number1092079998",
			"max": null,
			"min": null,
			"name": "credits",
			"onlyInt": true,
			"presentable": false,
			"required": true,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// 1b) Enforce simple auth rule on all user operations
		// rule := ` + "`@request.auth.id != \"\"`" + `
		// collection.CreateRule = &rule
		// collection.UpdateRule = &rule
		// collection.DeleteRule = &rule
		// collection.ViewRule   = &rule
		// collection.ListRule   = &rule

		// Persist changes to the users collection
		if err := app.Save(collection); err != nil {
			return err
		}

		// --- Migration 1 (continued): Create test superuser account ---
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		record := core.NewRecord(superusers)
		record.Set("email", "test@example.com")
		record.Set("password", "1234567890")

		return app.Save(record)
	}, func(app core.App) error {
		// --- Rollback 1: remove auth rules + "credits" field from users ---
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// clear the rule you added
		// collection.CreateRule = nil
		// collection.UpdateRule = nil
		// collection.DeleteRule = nil
		// collection.ViewRule   = nil
		// collection.ListRule   = nil
		//
		// remove the "credits" field
		collection.Fields.RemoveById("number1092079998")

		if err := app.Save(collection); err != nil {
			return err
		}

		// --- Rollback 1 (continued): delete the test superuser ---
		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, "test-superuser@example.com")
		if record == nil {
			return nil // nothing to delete
		}
		return app.Delete(record)
	})
}
