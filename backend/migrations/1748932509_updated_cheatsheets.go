package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1722640318")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("url4217704300")

		// remove field
		collection.Fields.RemoveById("url1468393708")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "file3277268710",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"image/jpeg",
				"image/vnd.mozilla.apng",
				"image/png",
				"image/webp"
			],
			"name": "thumbnail",
			"presentable": false,
			"protected": false,
			"required": true,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "file250665868",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"application/pdf"
			],
			"name": "pdf",
			"presentable": false,
			"protected": false,
			"required": true,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1722640318")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"exceptDomains": [],
			"hidden": false,
			"id": "url4217704300",
			"name": "pdfUrl",
			"onlyDomains": [],
			"presentable": false,
			"required": true,
			"system": false,
			"type": "url"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"exceptDomains": [],
			"hidden": false,
			"id": "url1468393708",
			"name": "thumbnailUrl",
			"onlyDomains": [],
			"presentable": false,
			"required": true,
			"system": false,
			"type": "url"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("file3277268710")

		// remove field
		collection.Fields.RemoveById("file250665868")

		return app.Save(collection)
	})
}
