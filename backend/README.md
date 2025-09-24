```shell
$ cd backend

# 仮想環境をつくる
$ python3 -m venv .venv

# 仮想環境をアクティベートする  
$ source .venv/bin/activate  # Unix / Macの場合
$ .venv/Scripts/activate    # windowsの場合

# 必要なライブラリをインストールする
$ pip install --upgrade pip setuptools wheel
$ pip install -r requirements.txt
```
アプリ起動
出力されたURLにアクセス
```shell
$ uvicorn main:app --reload --port 9000
```