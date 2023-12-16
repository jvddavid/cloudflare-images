# Cloudflare Images API

## Summary

## Install

```bash
npm i @jvddavid/cloudflare-images
```

## Auth

```javascript
import CloudFlareImages from '@jvvdavid/cloudflare-images';

const cloudflare = new CloudFlareImages({
  accountId: 'account_id', // mandatory
  token: 'token'
  // OR
  email: 'email',
  key: 'key'
});

```

# Images API

### List images

```javascript
const { success, errors, messages, result } = await cloudflare.listImages({ page: 1, perPage: 1000 })

// example of result
const result = {
  images: [
    {
      id: 'aiofaosu7-13515135-jhsduy8173',
      filename: 'demo.jpg',
      meta: { demo: 'demo' },
      requireSignedURLs: false,
      uploaded: '2014-01-02T02:20:00.123Z',
      variants: ['...'], // url of variants
    },
  ],
}
```

### List images V2

```javascript
const { success, errors, messages, result } = await cloudflare.listImagesV2({ perPage: 1000, sortOrder: null, continuationToken: null })

// example of result
const result = {
  images: [
    {
      id: 'aiofaosu7-13515135-jhsduy8173',
      filename: 'demo.jpg',
      meta: { demo: 'demo' },
      requireSignedURLs: false,
      uploaded: '2014-01-02T02:20:00.123Z',
      variants: ['...'], // url of variants
    },
  ],
  continuation_token: 'aispfahoshfao-asfibasi-safusaui',
}
```

### Stats

```javascript
const { success, errors, messages, result } = await cloudflare.stats()

// example of result
const result = {
  count: {
    allowed: 100000,
    current: 15,
  },
}
```

### Image details

```javascript
const { success, errors, messages, result } = await cloudflare.imageDetails('image_id')

// example of result
const result = {
  id: 'aiofaosu7-13515135-jhsduy8173',
  filename: 'demo.jpg',
  meta: { demo: 'demo' },
  requireSignedURLs: false,
  uploaded: '2014-01-02T02:20:00.123Z',
  variants: ['...'], // url of variants
}
```

### Base image

```javascript
const { success, errors, messages, result } = await cloudflare.image('image_id')

// example of result
const result = 'base64image' // or null
```

### Upload image

```javascript
const { success, errors, messages, result } = await cloudflare.uploadImage({ name: 'image_name', image: 'image_base64' /* string or Buffer or Blob */, metadata: { key: 'value' }, requireSignedURLs: false })

// example result
const result = {
  id: 'aiofaosu7-13515135-jhsduy8173',
  filename: 'demo.jpg',
  meta: { demo: 'demo' },
  requireSignedURLs: false,
  uploaded: '2014-01-02T02:20:00.123Z',
  variants: ['...'], // url of variants
}
```

### Upload image url

```javascript
const { success, errors, messages, result } = await cloudflare.uploadImageURL({ imageURL: 'https://example.com/image.png', metadata: { key: 'value' }, requireSignedURLs: false })

// example result
const result = {
  id: 'aiofaosu7-13515135-jhsduy8173',
  filename: 'demo.jpg',
  meta: { demo: 'demo' },
  requireSignedURLs: false,
  uploaded: '2014-01-02T02:20:00.123Z',
  variants: ['...'], // url of variants
}
```

### Update image

```javascript
const { success, errors, messages, result } = await cloudflare.updateImage({ imageId: 'image_id', metadata: { key: 'value' }, requireSignedURLs: false })

// example result
const result = {
  id: 'aiofaosu7-13515135-jhsduy8173',
  filename: 'demo.jpg',
  meta: { demo: 'demo' },
  requireSignedURLs: false,
  uploaded: '2014-01-02T02:20:00.123Z',
  variants: ['...'], // url of variants
}
```

### Delete image

```javascript
const { success, errors, messages, result } = await cloudflare.deleteImage('image_id')

// result is empty
const success = true
```

### Direct upload url

```javascript
const { success, errors, messages, result } = await cloudflare.directUploadUrlV2({ expiry: new Date(Date.now() + 1000 * 60 * 60 * 1), metadata: { key: 'value' }, requireSignedURLs: false })

// example of result
const result = {
  id: '7gaf8asg8vba97vga-avba78fa',
  uploadURL: '...',
}
```

# Images keys

### List Signing Keys

```javascript
const { success, errors, messages, result } = await cloudflare.listSigningKeys()

// example of result
const result = {
  keys: [
    {
      name: 'default',
      value: '...',
    },
  ],
}
```

# Images Variants

### List variants

```javascript
const { success, errors, messages, result } = await cloudflare.listVariants()

// example of result
const result = {
  variants: {
    hero: {
      id: 'hero',
      neverRequireSignedURLs: true,
      options: {
        fit: 'scale-down',
        height: 768,
        metadata: 'none',
        width: 1366,
      },
    },
  },
}
```

### Variant details

```javascript
const { success, errors, messages, result } = await cloudflare.variantDetails('variant_id')

// example of result
const result = {
  id: 'hero',
  neverRequireSignedURLs: true,
  options: {
    fit: 'scale-down',
    height: 768,
    metadata: 'none',
    width: 1366,
  },
}
```

### Create variant

```javascript
const { success, errors, messages, result } = await cloudflare.createVariant({ name: 'variant_name', options: { width: 100, height: 100, fit: 'contain', metadata: 'none' } })

// example of result
const result = {
  id: 'hero',
  neverRequireSignedURLs: true,
  options: {
    fit: 'scale-down',
    height: 768,
    metadata: 'none',
    width: 1366,
  },
}
```

### Update variant

```javascript
const { success, errors, messages, result } = await cloudflare.updateVariant({ id: 'variant_id', options: { width: 100, height: 100, fit: 'contain', metadata: 'none' }, neverRequireSignedURLs: false })

// example of result
const result = {
  id: 'hero',
  neverRequireSignedURLs: true,
  options: {
    fit: 'scale-down',
    height: 768,
    metadata: 'none',
    width: 1366,
  },
}
```

### Delete variant

```javascript
const { success, errors, messages, result } = await cloudflare.deleteVariant('variant_id')

// result is empty
const success = true
```
