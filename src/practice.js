require('dotenv').config();
const knex = require('knex');
const { format } = require('morgan');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

function searchByProductName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((r) => console.table(r));
}

searchByProductName('holo');

function paginateProducts(page) {
  const productsPerPage = 10,
    offset = productsPerPage * (page - 1);

  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then((r) => console.table(r));
}

paginateProducts(2);

function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then((r) => console.table(r));
}

getProductsWithImages();

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then((r) => console.table(r));
}

mostPopularVideosForDays(30);
