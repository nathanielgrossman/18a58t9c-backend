# lambdas for 18a58t9c
#### upload.js
(deprecated, has been replaced by 18a58t9c-upload)receive image data, convert to .jpg and .webp, compress, and save to s3.

#### get-all.js
retrieve all image entries from db and return as array. optionally takes a query string to return only a selected chunk of sequential image entries.

#### get-assorted.js
retrieve a selection of images from the db, chosen based on age, number of views, time last viewed, etc.

#### get-random.js
retrieve a single random image from the db

#### update-views.js
updates the views on a single image entry
