# API

Cartes.io is a platform that lets you create maps and markers for anything - and it's built atop a powerful API. You can use this API to create maps and markers, as well as get up to date info.

API base:
```http
https://cartes.io/
```

Note: to get back a response in JSON - you must pass the `Accept: application/json` header.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/1513231-878108cf-8607-4f3f-b4ca-a765aa88373a?action=collection%2Ffork&collection-url=entityId%3D1513231-878108cf-8607-4f3f-b4ca-a765aa88373a%26entityType%3Dcollection%26workspaceId%3Dcd5491f6-b311-4c12-b4a6-a2de8280cb58)

## Use Cases

There are many reasons to use the API. You can create maps and markers for anything, and integrate it wherever you'd like (as long as it's all legal).

You can also automate the placement of markers if your project needs to do so!

## Authorization

You can use the API without authorisation. When you create a marker or a map, each will return a token. You must use this token for further actions on the resource.

### Authorization for maps

You do not need an API key to create maps. When you create a map via API, it will return the map object with a token field. This token will only be returned once, and is required to edit or delete the resource you just created.

### Authorization for markers

| Map setting                              | Required parameter       | Type     | Description |
| :--------------------------------------- | :----------------------- | :------- | :---------- |
| Anyone can create markers                | -                        | -        | -           |
| Only logged in people can create markers | `api_key` or `map_token` | `string` | -           |
| Only the map owner can create markers    | `map_token`              | `string` | -           |

If the map settings allow anyone to create markers, you do not need an API key to create markers.

If the map settings allow only logged in people to create markers, you need an API key to create markers. To authenticate an API request, you should provide your API key in the `Authorization` header.

Regardless of the map settings, you can create markers if you have the map token.

When you create a marker via API, it will return the marker object with a token field. This token will only be returned once, and is required to edit or delete the resource you just created.

## Response Status Codes

Cartes.io returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 401         | `UNAUTHENTICATED`       |
| 403         | `UNAUTHORISED`          |
| 404         | `NOT FOUND`             |
| 429         | `TOO MANY REQUESTS`     |
| 500         | `INTERNAL SERVER ERROR` |


## Rate limits
Endpoints for creating resources are rate limited. If you make requests without being authenticated, those rate limits are much more restrictive and are both per-minute and per-day. When you make requests as an authenticated user with your access token, there are no daily limits and the per-minute ones are more permissive.

You can look at the response headers `X-RateLimit-Limit` and `X-RateLimit-Remaining` to determine how many more requests you can make in the given timeframe.

When you exceed the amount of requests allowed, you will receive a `429` response code with a header `Retry-After`, where the number represents how many seconds are left before you can retry the request.

# Endpoints

## Maps

### Get all public maps

```http
GET /api/maps
```

#### Optional query parameters

##### ids
Fetch only the maps with the corresponding IDs. Note, the maps must be public or unlisted.
```http
GET /api/maps?ids[]=048eebe4-8dac-46e2-a947-50b6b8062fec
```

##### category_ids
Get the public maps that contain the listed category ids.
```http
GET /api/maps?category_ids[]=1
```

##### withMine
Get the maps including the current users maps. Note: requires a valid API token associated to a user to be passed.
```http
GET /api/maps?withMine=true
```

##### with[]
You can expand `markers, markers.category, markers.locations, activeMarkers, activeMarkers.category, activeMarkers.locations, publicContributors, categories, activeCategories, related, user` in the response.
```http
GET /api/maps?with[]=markers
```

Note that expanding `user` will only return a user if that user is you (when passing an API token) or when the user has their profile set to public.

##### orderBy
Order the results by the field, in descending order.
```http
GET /api/maps?orderBy=markers_count
```

##### query
You can write simple queries to filter the results. It is loosely based on Stripes query parameter: https://stripe.com/docs/search#search-syntax. Note that in this version, you should not wrap strings or values in quotes.

```http
GET /api/maps?query=markers.category.name~shark
```

##### format
When requesting markers with the `with` query parameter, you can also choose to pass `format=geojson` to return the markers in GeoJSON format.

```http
GET /api/maps?with[]=markers&format=geojson
```
### Search all public maps

```http
GET /api/maps/search?q=xxx
```

### Create a map

```http
POST /api/maps
```

| Parameter                   | Type     | Rules                                           | Required | Description                                     |
| :-------------------------- | :------- | :---------------------------------------------- | :------- | :---------------------------------------------- |
| `title`                     | `string` | Max: 191                                        | -        | The title of the map                            |
| `slug`                      | `string` | Max: 255                                        | -        | The map slug. Currently un-used                 |
| `description `              | `string` | -                                               | -        | The description of the map and its purpose      |
| `privacy`                   | `string` | Must be one of: `public`, `unlisted`, `private` | -        | The privacy level of the map                    |
| `users_can_create_markers ` | `string` | Must be one of: `yes`, `no`, `only_logged_in`   | -        | The setting that defines who can create markers |

If you're unauthenticated, you will be limited as to how many maps you can create per day.

If you don't create any markers on your map within a day, it will automatically be deleted.

### Create a map from file

Yuo can create a map and its markers from an existing GPX file.

```http
POST /api/maps/file
```

| Parameter | Type       | Rules                | Required | Description          |
| :-------- | :--------- | :------------------- | :------- | :------------------- |
| `file`    | A GPX file | One of filetype: GPX | Yes      | The title of the map |

To create a map and post markers in bulk via file, you must create a personal access token in your account settings and be approved to create markers in bulk. To request approval to use this endpoint, email us.

### Get a single map

```http
GET /api/maps/{map-uuid}
```

Sample response from [https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec](https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec):
```json
{
  "slug": "048eebe4-8dac-46e2-a947-50b6b8062fec",
  "title": "Demo map",
  "description": "This map is a demo map, meant to help you try out this website. You can create markers here willy-nilly, but please behave. Information on this map is not real or accurate.",
  "privacy": "public",
  "users_can_create_markers": "yes",
  "options": null,
  "uuid": "048eebe4-8dac-46e2-a947-50b6b8062fec",
  "created_at": "2020-05-03T15:24:48+02:00",
  "updated_at": "2020-11-20T01:59:58+01:00",
  "categories": [
    {
      "id": 13,
      "name": "Wind turbine",
      "icon": "/images/marker-01.svg",
      "markers_count": 1
    }
  ]
}
```

Keep in mind that our frontend SPA supports Markdown in the `description` field, so when developing your own applications you may need to parse that.

### Get a maps static image

Returns a rendered version of the map as an image.

```http
GET /api/maps/{map-uuid}/images/static
```

The generated images are cached for 6 hours on the server before being updated again.

The generated map is center relative to the average of all markers, with a default zoom level of 5. You can change the zoom by passing a `zoom` query parameter with the value (2-19) you want.

### Get related public maps

```http
GET /api/maps/{map-uuid}/related
```

### Edit a single map

```http
PUT /api/maps/{map-uuid}
```

To edit a map, you need to pass the `map_token` in the request. If the map is associated to your account you can pass an API key instead.

### Delete a single map

```http
DELETE /api/maps/{map-uuid}
```

### Claim a map

If you have a `map_token` and would like to associate a map with your user account on Cartes.io, you can use this endpoint. You must also pass an API authentication token to use this endpoint.

```http
POST /api/maps/{map-uuid}/claim
```

### Un-claim a map

If your map is associated to your Cartes.io account and you'd like to make it anonymous, you can use this endpoint. A valid API token is required to use this endpoint.

```http
DELETE /api/maps/{map-uuid}/claim
```

## Markers

### Get all markers on a map

```http
GET /api/maps/{map-uuid}/markers
```

| Parameter      | Type      | Required | Description                                          |
| :------------- | :-------- | :------- | :--------------------------------------------------- |
| `show_expired` | `Boolean` | -        | Show markers that have already expired               |
| `format`       | `String`  | -        | Pass `geojson` to get back markers in GeoJSON format |

Sample response from [https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec/markers](https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec/markers):

```json
[
  {
    "id": 108,
    "location": {
      "type": "Point",
      "coordinates": [
        45.691931857983,
        10.72265625
      ]
    },
    "category_id": 6,
    "created_at": "2020-05-03T15:25:52+02:00",
    "updated_at": "2020-05-03T15:25:52+02:00",
    "description": "Great views from this watch-tower",
    "expires_at": "2021-05-03T18:25:52+02:00",
    "category": {
      "id": 6,
      "name": "Observation point",
      "slug": "observation-point",
      "icon": "/images/marker-01.svg"
    }
  }
]
```

### Create a marker on a map

```http
POST /api/maps/{map-uuid}/markers
```

| Parameter       | Type              | Rules                   | Required                               | Description                                                                                                                                                         |
| :-------------- | :---------------- | :---------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `category`      | `int`             | Exists in categories    | Only if `category_name` is not present | If you know the category ID that you want to use, pass it with this parameter. Otherwise, use `category_name`                                                       |
| `lat`           | `numeric`         | Between: -90,90         | Yes                                    | The lat position of the marker                                                                                                                                      |
| `lng`           | `numeric `        | Between: -180,180       | Yes                                    | The lng position of the marker                                                                                                                                      |
| `zoom`          | `numeric `        | Between: 0,20           | -                                      | The zoom level of the marker                                                                                                                                        |
| `elevation`     | `numeric`         | Between: -100000,100000 | -                                      | The elevation in meters of the marker. If not passed, Cartes.io will at some point (up to a day) compute the height above or below sea level for the given location |
| `heading`       | `numeric`         | Between: 0,359          | -                                      | The heading that the marker is pointing                                                                                                                             |
| `pitch`         | `numeric`         | Between: -90,90         | -                                      | The pitch of the marker relative to the horizon                                                                                                                     |
| `roll`          | `numeric`         | Between: -180,180       | -                                      | The roll of the marker relative to the horizon                                                                                                                      |
| `speed`         | `numeric`         | Between: -100000,100000 | -                                      | The indicated speed of the marker in meters per second. This is different than groundspeed, which should be computed between two or more `markerLocation`s          |
| `description`   | `string `         | Max: 191                | -                                      | A description associated with the marker                                                                                                                            |
| `category_name` | `string`          | Min: 3, Max: 32         | Only if `category` is not present      | If you don't know the category ID you want to use or you want to create a new category, pass this parameter                                                         |
| `meta`          | `array` or `json` | Max: 10 elements        | -                                      | Custom meta tags                                                                                                                                                    |

Note: if you're unauthenticated, you will be limited as to how many markers you can create per day.

The optional `zoom` parameter helps determine how precise the marker should be. Have a look at [this table](https://nominatim.org/release-docs/latest/api/Reverse/#result-limitation) to determine the precision levels.

### Get a single marker on a map

N/A

### Get all locations for a single marker

```http
GET /api/maps/{map-uuid}/markers/{marker-id}/locations
```

### Edit a marker on a map

```http
PUT /api/maps/{map-uuid}/markers/{marker-id}
```

| Parameter     | Type      | Rules    | Required | Description                              |
| :------------ | :-------- | :------- | :------- | :--------------------------------------- |
| `description` | `string ` | Max: 191 | -        | A description associated with the marker |

You should pass the marker `token` in the request. If the marker is associated with your account, you can pass an API key instead.

### Create a new location for a marker on a map

```http
POST /api/maps/{map-uuid}/markers/{marker-id}/locations
```

| Parameter   | Type       | Rules             | Required | Description                                                                                                                                                                                                                                                                        |
| :---------- | :--------- | :---------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lat`       | `numeric`  | Between: -90,90   | Yes      | The lat position of the marker                                                                                                                                                                                                                                                     |
| `lng`       | `numeric ` | Between: -180,180 | Yes      | The lng position of the marker                                                                                                                                                                                                                                                     |
| `zoom`      | `numeric ` | Between: 0,20     | -        | The zoom level of the marker                                                                                                                                                                                                                                                       |
| `elevation` | `numeric`  | Between: 0,100000 | -        | The elevation in meters of the new position. This parameter will only be applied if both `lat` and `lng` are also sent in the request. If `lat` and `lng` are passed but not this parameter, Cartes.io will compute the height above or below sea level for the given coordinates. |
| `heading`   | `numeric`  | Between: 0,359    | -        | The heading that the marker is pointing                                                                                                                                                                                                                                            |
| `pitch`     | `numeric`  | Between: -90,90   | -        | The pitch of the marker relative to the horizon                                                                                                                                                                                                                                    |
| `roll`      | `numeric`  | Between: -180,180 | -        | The roll of the marker relative to the horizon                                                                                                                                                                                                                                     |
| `speed`     | `numeric`  | Between: 0,100000 | -        | The indicated speed of the marker in meters per second. This is different than groundspeed, which should be computed between two or more `markerLocation`s                                                                                                                         |

You should pass the marker `token` in the request. If the marker is associated with your account, you can pass an API key instead.

### Mark a marker as spam

```http
PUT /api/maps/{map-uuid}/markers/{marker-id}
```

| Parameter | Type       | Rules | Required | Description                       |
| :-------- | :--------- | :---- | :------- | :-------------------------------- |
| `is_spam` | `boolean ` | -     | -        | Whether or not the marker is spam |

Only the map owner can mark a marker as spam. You should either pass a `map_token` or, if the map is associated with your account, an API key.

You cannot mark your own markers as spam.

### Delete a marker on a map

```http
DELETE /api/maps/{map-uuid}/markers/{marker-id}
```

### Create markers in bulk

```http
POST /api/maps/{map-uuid}/markers/bulk
```
Provide an array of `markers`. This array should contain marker objects with the following formatting/rules:

| Parameter       | Type                                                                                                    | Rules                             | Required                                 | Description                                                                                                                |
| :-------------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `category`      | `int`                                                                                                   | Exists in categories              | Only if `category_name` is not present   | If you know the category ID that you want to use, pass it with this parameter. Otherwise, use `category_name`              |
| `locations`     | `array` of locations (each location having a `lat`, `lng`, and `category` or `category_name`, at least) | Contains valid data for locations | Only if `lat` and `lng` are not provided | An array of locations (usually over time, by passing `created_at` and `updated_at` with each location)  for a given marker |
| `lat`           | `numeric`                                                                                               | Between: -90,90                   | Only if `locations` is not provided      | The lat position of the marker                                                                                             |
| `lng`           | `numeric `                                                                                              | Between: -180,180                 | Only if `locations` is not provided      | The lng position of the marker                                                                                             |
| `description`   | `string `                                                                                               | Max: 191                          | -                                        | A description associated with the marker                                                                                   |
| `category_name` | `string`                                                                                                | Min: 3, Max: 32                   | Only if `category` is not present        | If you don't know the category ID you want to use or you want to create a new category, pass this parameter                |
| `created_at`    | `timestamp`                                                                                             | -                                 | -                                        | When the marker was created                                                                                                |
| `updated_at`    | `timestamp`                                                                                             | -                                 | -                                        | When the marker was updated                                                                                                |
| `expires_at`    | `timestamp`                                                                                             | -                                 | -                                        | When the marker expired                                                                                                    |
| `meta`          | `array` or `json`                                                                                       | Max: 10 elements                  | -                                        | Custom meta tags                                                                                                           |

To post markers in bulk, you must create a personal access token in your account settings and be approved to create markers in bulk. To request approval to use this endpoint, email us.

### Create markers from file (GPX, GeoJSON)

```http
POST /api/maps/{map-uuid}/markers/file
```

| Parameter | Type   | Rules                         | Required | Description                                 |
| :-------- | :----- | :---------------------------- | :------- | :------------------------------------------ |
| `file`    | `file` | One of filetype: GPX, GeoJSON | Yes      | The file from which to extract markers from |

To post markers in bulk via file, you must create a personal access token in your account settings and be approved to create markers in bulk. To request approval to use this endpoint, email us.

## Categories

### Get all categories

```http
GET /api/categories
```

### Search all categories

```http
GET /api/categories/search?q=xxx
```

### Create a category

Create categories while creating new markers.

### Get a single category

N/A

### Get related categories

```http
GET /api/categories/{category-id}/related
```

### Edit a single category

N/A

### Delete a single category

N/A

## User
The following endpoints require authentication with a valid API token.

### Get yourself
```http
GET /api/user
```

## Attribution and use policy

In any application you make that uses this API, you must attribute Cartes.io in a clear and visible manner. Additionally, if showing category icons, you must attribute Icons8, the icon provider.

Additionally, you must respect the map privacy options. If the `privacy` is set to `unlisted` or `private`, you may not include the map data in indexes, return the data on search pages, or make them public in any manner that compromises the integrity of the `privacy` setting.