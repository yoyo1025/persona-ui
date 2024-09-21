# nodeのバージョン指定
FROM node:20.17.0

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションのファイルをコピー
COPY . .

# アプリケーションの起動
CMD ["npm", "run", "dev", "--", "--host"]