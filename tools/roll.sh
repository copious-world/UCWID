pwd
if [ ! -d "$DIR" ]; then
    echo "Making directory $DIR"
    mkdir "$DIR"
fi
DIR='./client/modules/'
if [ ! -d "$DIR" ]; then
    echo "Making directory $DIR"
    mkdir "$DIR"
fi
DIR='./assets/'
if [ ! -d "$DIR" ]; then
    echo "Making directory $DIR"
    mkdir "$DIR"
fi
cp -R './node_modules/cwid/client/' './client/client/'
cp -R './node_modules/cwid/modules/' './client/modules/'
cp -R './node_modules/cwid/assets/' './assets/'
cp -R './node_modules/crypto-wraps/client/' './client/client/'
cp -R './node_modules/crypto-wraps/modules/' './client/modules/'
