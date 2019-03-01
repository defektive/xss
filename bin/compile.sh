#! /bin/bash

ID=$1
cat src/xss.as | sed 's/{XSSSWFID}/'$ID'/g' > /tmp/xss.as
as3compile xss.as -o dist/xss.swf
