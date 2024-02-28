# iFrame embedding

## Usage
You can use an iFrame to embed any public or unlisted map on your website. To do so, create an iFrame and set the source to `https://app.cartes.io/maps/{your-map-id}/embed?type=map`. Just like on the site, you can use `lat`, `lng`, and `zoom` in the URL query parameters to set the map to a specific position.

### Demo map code
To embed the demo map for example, you'd use the following code.

```html
<iframe src="https://app.cartes.io/maps/048eebe4-8dac-46e2-a947-50b6b8062fec/embed?type=map"
  width="100%"
  height="400"
  frameborder="0"></iframe>
```

Whuch would result in the following interactive map:
<iframe src="https://app.cartes.io/maps/048eebe4-8dac-46e2-a947-50b6b8062fec/embed?type=map"
  width="100%"
  height="400"
  frameborder="0"></iframe>

## postMessage events
You can listen to postMessage events emitted when embedding a map using iFrames. Each event is an object, containing the event type (see below), and the data.

For security reasons, you should always verify that the origin is "https://app.cartes.io".

See the example in JSFiddle: https://jsfiddle.net/cLpvtbej/2/

```js
window.addEventListener("message", (event) => {
  if (event.origin !== "https://app.cartes.io") {
    return;
  }
  console.log(event.data.type, event.data.data);
}, false);
```

Read more about using postMessage here: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

### updated_map
Emitted when the map settings are updated. The `map` object will be available in the `data` key.

### deleted_map
Emitted when the map is deleted. The `map` object will be available in the `data` key.

### created_marker
Emitted when a marker is created. The `marker` object will be available in the `data` key.

### deleted_marker
Emitted when a marker is deleted. The `marker` object will be available in the `data` key.