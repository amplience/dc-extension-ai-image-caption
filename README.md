# dc-extension-ai-image-caption

> AI powered image caption text field for use in [Amplience Dynamic Content](https://amplience.com/dynamic-content)

![Amplience Dynamic Content AI Image Caption Extension](media/screenshot.png)

This extension uses artificial intelligence to automatically generate image captions for use as alternative text, which is read aloud by screen readers used by visually impaired users.

You can configure whether image captions are generated automatically when users add images to fields, or manually when requested by users.

> Note: This extension is a **LABS PREVIEW** for use as is without support or warranty.

## How to install

### Register the Extension

This extension must be [registered](https://amplience.com/docs/development/registeringextensions.html) against a hub with in the Dynamic Content application (Development -> Extensions).

![Setup](media/setup.png)

- Category: Content Field
- Label: AI Image Caption
- Name: ai-image-caption _(needs to be unique with the hub)_
- URL: [https://ai-image-caption.extensions.content.amplience.net](https://ai-image-caption.extensions.content.amplience.net)
- Description: _(can be left blank, if you wish)_
- Initial height: 200

### Permissions

![Permissions](media/permissions.png)

API permissions:
- Read access
- Modify access

Sandbox permissions:
- Allow same origin 
- Allow pop-ups

### Assign the extension to schema

To use the alt text extension, simply associate it with an image field and a string field (that represents the caption) in your content type schema.

The string field should be configured to use the `ui:extension` keyword, and use the name that was used to register the extension. An image param must be included to inform the extension which image property it should be linked to.

The `image` param should be a valid [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901).

```json
{
  "image": {
    "title": "Hero Image",
    "allOf": [
      {
        "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
      }
    ]
  },
  "imageCaption": {
    "title": "Hero Alt Text",
    "type": "string",
    "minLength": 0,
    "maxLength": 200,
    "ui:extension": {
      "name": "ai-image-caption",
      "params": {
        "image": "/image"
      }
    }
  }
}
```

## Configuration

You can customize the alt text generator by providing `"params"` in the installation parameters, or inside your content type schema by adding them to `"params"` object in your `"ui:extension"`.

### Image property

The extension must be linked to an image property using a [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901). When a caption is requested, the extension will use the image assigned to this property as the input.

```json
{
  "image": "/pointer/to/image"
}
```

If the extension is used inside a partial that is included in multiple content types, you can use a [relative JSON pointer](https://www.ietf.org/id/draft-hha-relative-json-pointer-00.html) to define the image field.

```json
{
  "image": {
    "allOf": [
      {
        "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
      }
    ]
  },
  "imageCaption": {
    "title": "Hero Alt Text",
    "type": "string",
    "minLength": 0,
    "maxLength": 200,
    "ui:extension": {
      "name": "ai-image-caption",
      "params": {
        "image": "1/image"
      }
    }
  }
}
```

If the extension is used in an array field, the pointer of the image field must be relative to the caption field

```json
{
  "images": {
    "title": "Images with captions",
    "type": "array",
    "minItems": 0,
    "maxItems": 10,
    "items": {
      "type": "object",
      "properties": {
        "image": {
          "title": "Hero Image",
          "allOf": [
            {
              "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
            }
          ]
        },
        "imageCaption": {
          "title": "Hero Alt Text",
          "type": "string",
          "minLength": 0,
          "maxLength": 200,
          "ui:extension": {
            "name": "ai-image-caption",
            "params": {
              "image": "/image"
            }
          }
        }
      },
      "propertyOrder": []
    }
  }
}
```

### Auto caption

If enabled, the extension will automatically generate a caption when the image property is populated instead of requiring the user to manually press the generate button.

```json
{
  "autoCaption": true
}
```

## Limitations

- 50 caption limit per day per organization
- This extension is only compatible with hubs that are linked to an organization. Accounts that have not yet [migrated](https://amplience.com/developers/docs/knowledge-center/faqs/account/) from legacy permissions will not see the AI caption feature.
- This extension is in **LABS PREVIEW** for use as is without support or warranty
- Restoring the content item via the version history to a version that doesn't have alt text will send a graphql request that will populate the alt text field
- Images must be hosted / served by Amplience
- The Image object that you configure to point to MUST be a standard Amplience image object as per the [data type](https://amplience.com/developers/docs/schema-reference/data-types/#image) and associated image link

## How to run locally

Extension:

- `npm run install`
- `npm run build`
- `npm run start`

Storybook:

- `npm run storybook`
