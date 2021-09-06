#!/bin/bash

for FILE in `ls`
do
	fn=$(basename "$FILE")
	ext=`echo "$fn" | cut -d'.' -f2`
	fn=`echo "$fn" | cut -d'.' -f1`

	if [[ "$ext" = "jpg" || "$ext" = "png" ]]; then
		convert "$FILE" -resize 1000x1000 -quality 95% "$fn""_1000.""$ext"
		convert "$FILE" -resize 640x640 -quality 95% "$fn""_640.""$ext"
		convert "$FILE" -resize 380x380 -quality 95% "$fn""_380.""$ext"
	fi
done
