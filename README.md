GrydCLI
=========
Command line interface for managing Gryd-based projects

### NOTE: This tool may not yet run on Windows (Requires git, rm, cp commands)

### Features
  - Quickly initialize new GrydProjects
  - Create modular applications on the fly
  - Auto-generate RESTful resources
  - Switch between new and old GrydProject versions
  - Help menu changes based on available commands
  - Freely modify the local install of GrydProject for use in newly generated projects

Installation
----
```js
    npm install -g gryd-cli

    //On first use
    gryd-cli install
```
Tests (Coming soon)
--------------

```js
    npm test
```

Usage
----
gryd-cli command params [--options]
#### gryd-cli install [--v version]
    Upon first use of the GrydCLI, install the latest (or selected) version of GrydProject locally for future use.

#### gryd-cli init name [--validator --docs]
    Initialize a new GrydProject in the current directory. Optionally install other GrydTools.

#### gryd-cli app name
    Generate a blank application in the current project.

#### gryd-cli resource app name
    Generate a RESTful resource (Model + Controller) in the application `app`
    
#### gryd-cli update [--v version]
    Update the local install of GrydProject to the latest (or selected) version of GrydProject
    
    

Change Log
----
#### 0.1.0
>Initial development


Contributors
----
Aaron Blankenship


License
----

Copyright (c) 2014, Aaron Blankenship

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.