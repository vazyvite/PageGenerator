"D:\Programmes\7-Zip\7z.exe" a -tzip pslgen.nw * -xr!*.nw -xr!*.eot -xr!*.ttf -xr!*.svg -xr!*.woff2 -xr!*.scss  -xr!node_modules
..\nwjs-sdk-v0.13.4-win-x64\nw.exe pslgen.nw
rem "C:\Program Files\nodejs\nwjs-v0.12.3-win-x64\nw.exe" pslgen.nw --remote-debugging-port=9221
