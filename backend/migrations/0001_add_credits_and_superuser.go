package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
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

		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		record := core.NewRecord(superusers)
		record.Set("email", "test@example.com")
		record.Set("password", "1234567890")

		return app.Save(record)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		collection.Fields.RemoveById("number1092079998")

		if err := app.Save(collection); err != nil {
			return err
		}

		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, "test@example.com")
		if record == nil {
			return nil 
		}
		return app.Delete(record)
	})
}
