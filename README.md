# myapp
## 「横浜周辺スーパー銭湯APP」
このアプリは、ユーザー登録すると、銭湯一覧が見れ、お気に入り、評価を登録できる。
また、銭湯一覧に、新しい銭湯の追加もできる。
おまけとして、銭湯一覧の地図も見れる。この地図はユーザー登録してなくても見れる。

### 直せていないバグ
評価順に並び替え表示の状態で、お気に入りにチェックを入れたり、評価を変えたりするとバグがでます。
これは、並び替えの際、jsonオブジェクトから配列に変換し、ソートしている影響で、keyの値を失っているからです。
firebaseのorderByで並び替えようとしたりしましたがうまくいかなかったため現状バグが出ています。

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
