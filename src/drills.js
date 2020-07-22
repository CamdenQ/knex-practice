require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

function searchNameByString(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((r) => {
      console.log(`Search for ${searchTerm} in NAME:`);
      console.table(r);
    });
}

searchNameByString('steak');

function paginateShoppingList(page) {
  const itemsPerPage = 6,
    offset = itemsPerPage * (page - 1);

  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then((r) => {
      console.log(`Paginate items to page ${page}:`);
      console.table(r);
    });
}

paginateShoppingList(4);

function getItemsAddedAfter(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then((r) => {
      console.log(`List items added after ${daysAgo} days ago:`);
      console.table(r);
    });
}

getItemsAddedAfter(10);

function totalCosts() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then((r) => {
      console.log('Categories with total price:');
      console.table(r);
    });
}

totalCosts();
