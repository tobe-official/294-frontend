package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// --- Migration: Create/Update cheatsheets collection with open rules ---

		// your existing JSON definition (with null rules)
		jsonData := `{
			"createRule": null,
			"deleteRule": null,
			"fields": [
				{
					"autogeneratePattern": "[a-z0-9]{15}",
					"hidden": false,
					"id": "text3208210256",
					"max": 15,
					"min": 15,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text724990059",
					"max": 0,
					"min": 0,
					"name": "title",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text1843675174",
					"max": 0,
					"min": 0,
					"name": "description",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"exceptDomains": [],
					"hidden": false,
					"id": "url4217704300",
					"name": "pdfUrl",
					"onlyDomains": [],
					"presentable": false,
					"required": true,
					"system": false,
					"type": "url"
				},
				{
					"cascadeDelete": false,
					"collectionId": "_pb_users_auth_",
					"hidden": false,
					"id": "relation1668006755",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "uploader",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
				},
				{
					"exceptDomains": [],
					"hidden": false,
					"id": "url1468393708",
					"name": "thumbnailUrl",
					"onlyDomains": [],
					"presentable": false,
					"required": true,
					"system": false,
					"type": "url"
				},
				{
					"hidden": false,
					"id": "autodate2990389176",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "autodate3332085495",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_1722640318",
			"indexes": [],
			"listRule": null,
			"name": "cheatsheets",
			"system": false,
			"type": "base",
			"updateRule": null,
			"viewRule": null
		}`

		// unmarshal into a new Collection struct
		var collection core.Collection
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		// explicitly clear any rule guards (ensure fully open)
		collection.CreateRule = nil
		collection.UpdateRule = nil
		collection.DeleteRule = nil
		collection.ViewRule   = nil
		collection.ListRule   = nil

		return app.Save(&collection)
	}, func(app core.App) error {
		// --- Rollback: delete the cheatsheets collection ---
		collection, err := app.FindCollectionByNameOrId("pbc_1722640318")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
