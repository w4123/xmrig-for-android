
all: 
	toolchain
	libuv
	hwloc
	xmrig

toolchain:
	script/toolchain-build.sh

libuv: toolchain libuv_dl
	script/libuv-build.sh

libuv_dl:
	script/libuv-fetch.sh

xmrig: toolchain xmrig_dl
	script/xmrig-build.sh

xmrig_dl:
	script/xmrig-fetch.sh

hwloc: toolchain hwloc_dl
	script/hwloc-build.sh

hwloc_dl:
	script/hwloc-fetch.sh

install: all
	script/install.sh

clean:
	script/clean.sh
