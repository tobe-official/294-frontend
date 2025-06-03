package migrations

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Locate the existing "cheatsheets" collection
		collection, err := app.FindCollectionByNameOrId("cheatsheets")
		if err != nil {
			return err
		}

		for i := 1; i <= 100; i++ {
			rec := core.NewRecord(collection)
			title := fmt.Sprintf("Test Cheat Sheet %d", i)
			desc := fmt.Sprintf("Sample description for cheat sheet %d", i)
			pdf := fmt.Sprintf("https://example.com/cheatsheet%d.pdf", i)
			thumb := "https://picsum.photos/400/300"
			stars := (i%5 + 1)

			rec.Set("title", title)
			rec.Set("description", desc)
			rec.Set("pdfUrl", pdf)
			rec.Set("thumbnailUrl", thumb)
			rec.Set("stars", stars)

			if err := app.Save(rec); err != nil {
				return fmt.Errorf("failed to insert %q: %w", title, err)
			}
		}

		return nil
	}, func(app core.App) error {
		return nil
	})
}
