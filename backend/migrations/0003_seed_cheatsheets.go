package migrations

import (
    "github.com/pocketbase/pocketbase/core"
    m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
    m.Register(func(app core.App) error {
        // 1) Find the cheatsheets collection
        collection, err := app.FindCollectionByNameOrId("pbc_1722640318")
        if err != nil {
            return err
        }

        // 2) Seed cheat sheets
        cheatSheets := []struct {
            id          string
            title       string
            description string
            pdfUrl      string
            thumbnailUrl string
            stars       int
        }{
            {"seedcheat000001", "Go PocketBase Basics", "Quick reference for PocketBase Go SDK", "https://example.com/cheatsheet1.pdf", "https://example.com/thumb1.png", 8},
            {"seedcheat000002", "React PocketBase Integration", "Tips for using PocketBase with React", "https://example.com/cheatsheet2.pdf", "https://example.com/thumb2.png", 9},
            {"seedcheat000003", "Advanced Go Concurrency", "Patterns and tips for Go concurrency", "https://example.com/cheatsheet3.pdf", "https://example.com/thumb3.png", 10},
            {"seedcheat000004", "React Hooks Deep Dive", "Comprehensive guide to React hooks", "https://example.com/cheatsheet4.pdf", "https://example.com/thumb4.png", 9},
            {"seedcheat000005", "TypeScript Essentials", "Key TypeScript patterns and utilities", "https://example.com/cheatsheet5.pdf", "https://example.com/thumb5.png", 8},
            {"seedcheat000006", "CSS Grid Layout", "Quick reference for modern CSS Grid", "https://example.com/cheatsheet6.pdf", "https://example.com/thumb6.png", 7},
            {"seedcheat000007", "Sass Mixins and Functions", "Reusable Sass utilities", "https://example.com/cheatsheet7.pdf", "https://example.com/thumb7.png", 7},
            {"seedcheat000008", "Git Workflows", "Common Git commands and workflows", "https://example.com/cheatsheet8.pdf", "https://example.com/thumb8.png", 8},
            {"seedcheat000009", "Docker Essentials", "Basic Docker commands and patterns", "https://example.com/cheatsheet9.pdf", "https://example.com/thumb9.png", 8},
            {"seedcheat000010", "Kubernetes Basics", "Core Kubernetes concepts and CLI", "https://example.com/cheatsheet10.pdf", "https://example.com/thumb10.png", 9},
            {"seedcheat000011", "PostgreSQL Tips", "Common PostgreSQL queries and tips", "https://example.com/cheatsheet11.pdf", "https://example.com/thumb11.png", 7},
            {"seedcheat000012", "MongoDB Quickstart", "Key MongoDB shell commands", "https://example.com/cheatsheet12.pdf", "https://example.com/thumb12.png", 6},
            {"seedcheat000013", "Azure DevOps Pipelines", "Pipeline YAML reference", "https://example.com/cheatsheet13.pdf", "https://example.com/thumb13.png", 9},
            {"seedcheat000014", "JWT Authentication", "Guide to using JWT securely", "https://example.com/cheatsheet14.pdf", "https://example.com/thumb14.png", 8},
            {"seedcheat000015", "OAuth 2.0 Flows", "Common OAuth 2.0 patterns", "https://example.com/cheatsheet15.pdf", "https://example.com/thumb15.png", 8},
            {"seedcheat000016", "REST API Design", "Principles of good REST API design", "https://example.com/cheatsheet16.pdf", "https://example.com/thumb16.png", 9},
            {"seedcheat000017", "GraphQL Basics", "Getting started with GraphQL", "https://example.com/cheatsheet17.pdf", "https://example.com/thumb17.png", 7},
            {"seedcheat000018", "React Testing Library", "Writing tests for React components", "https://example.com/cheatsheet18.pdf", "https://example.com/thumb18.png", 9},
            {"seedcheat000019", "Cypress Testing", "End-to-end testing with Cypress", "https://example.com/cheatsheet19.pdf", "https://example.com/thumb19.png", 9},
            {"seedcheat000020", "Next.js Routing", "How routing works in Next.js", "https://example.com/cheatsheet20.pdf", "https://example.com/thumb20.png", 8},
            {"seedcheat000021", "Tailwind CSS Basics", "Utility classes in Tailwind CSS", "https://example.com/cheatsheet21.pdf", "https://example.com/thumb21.png", 8},
            {"seedcheat000022", "Node.js Streams", "Working with Node.js streams", "https://example.com/cheatsheet22.pdf", "https://example.com/thumb22.png", 7},
            {"seedcheat000023", "Express Middleware", "Building reusable middleware", "https://example.com/cheatsheet23.pdf", "https://example.com/thumb23.png", 7},
            {"seedcheat000024", "Go Testing Patterns", "Unit and integration testing in Go", "https://example.com/cheatsheet24.pdf", "https://example.com/thumb24.png", 9},
            {"seedcheat000025", "Helm Charts", "Package and deploy with Helm", "https://example.com/cheatsheet25.pdf", "https://example.com/thumb25.png", 8},
            {"seedcheat000026", "Azure Functions", "Serverless with Azure Functions", "https://example.com/cheatsheet26.pdf", "https://example.com/thumb26.png", 8},
            {"seedcheat000027", "gRPC Basics", "Intro to gRPC and Protocol Buffers", "https://example.com/cheatsheet27.pdf", "https://example.com/thumb27.png", 7},
            {"seedcheat000028", "Terraform Essentials", "Provisioning infrastructure with Terraform", "https://example.com/cheatsheet28.pdf", "https://example.com/thumb28.png", 9},
            {"seedcheat000029", "Python FastAPI", "Building APIs with FastAPI", "https://example.com/cheatsheet29.pdf", "https://example.com/thumb29.png", 8},
            {"seedcheat000030", "OpenTelemetry Basics", "Observability with OpenTelemetry", "https://example.com/cheatsheet30.pdf", "https://example.com/thumb30.png", 7},
        }

        for _, cs := range cheatSheets {
            record := core.NewRecord(collection)
            record.Set("id", cs.id)
            record.Set("title", cs.title)
            record.Set("description", cs.description)
            record.Set("pdfUrl", cs.pdfUrl)
            record.Set("thumbnailUrl", cs.thumbnailUrl)
            record.Set("stars", cs.stars)

            if err := app.Save(record); err != nil {
                return err
            }
        }

        return nil
    }, func(app core.App) error {
        return nil
    })
}
