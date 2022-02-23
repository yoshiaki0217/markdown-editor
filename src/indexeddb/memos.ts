import Dexie from 'dexie'

export interface MemoRecord {
  datetime: string
  title: string
  text: string
}

// ▼▼テーブル作成▼▼

// データベース名定義
const database = new Dexie('markdown-editor')

// version(1) ＝ データベースのバージョン
// stores = 使用するテーブルとインデックスとなるデータ名を指定
database.version(1).stores({ memos: '&datetime' })

// MemoRecordはデータの型で、2つ目のstringはキーとなるデータ
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')


// ▼▼テーブル保存▼▼

// タイトルとテキストを引数として受け取る関数を定義
export const putMemo = async (title: string, text: string): Promise<void> => {
  // 日時取得(ISO8601 の形式で出力)
  const datetime = new Date().toISOString()
  // DB保存
  await memos.put({datetime,title,text})
}

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async (): Promise<number> => {
  const totalCount = await memos.count()
  const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
  return pageCount > 0 ? pageCount : 1
}

// ▼▼データ取得▼▼
export const getMemos = (page: number): Promise<MemoRecord[]> => {
  const offset = (page - 1) * NUM_PER_PAGE
  return memos.orderBy('datetime')
    .reverse()
    .offset(offset)
    .limit(NUM_PER_PAGE)
    .toArray()
}
