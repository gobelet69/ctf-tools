# Dependencies

Native Web API first. Small local dependency second. Heavy dependency only when clearly justified.

### md5.min.js
- version 2.19.0
- exact local byte size: 3750 bytes
- purpose: Compute MD5 hashes (WebCrypto API dropped MD5 support)
- pages using it: `/hash/hash-text.html`, `/forensics/file-hash.html`
- lazy/global loading behavior: Locally hosted, loaded synchronously only on the pages that explicitly require it.

### exif.js
- version 2.3.0
- exact local byte size: 14346 bytes
- purpose: Extract EXIF metadata from JPEG/TIFF images
- pages using it: `/stego/exif.html`
- lazy/global loading behavior: Locally hosted, lazy-loaded via JavaScript solely when the EXIF Viewer page is accessed and an image is processed.
