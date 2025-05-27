package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// --- Migration 1: Add "credits" field to _pb_users_auth_ collection ---

		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

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

		if err := app.Save(collection); err != nil {
			return err
		}

		// --- Migration 2: Create test superuser account ---

		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		record := core.NewRecord(superusers)
		record.Set("email", "test@example.com")
		record.Set("password", "1234567890")

		return app.Save(record)

	}, func(app core.App) error {
		// --- Rollback 1: Remove "credits" field from _pb_users_auth_ collection ---

		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		collection.Fields.RemoveById("number1092079998")

		if err := app.Save(collection); err != nil {
			return err
		}

		// --- Rollback 2: Delete test superuser account ---

		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, "test@example.com")
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
