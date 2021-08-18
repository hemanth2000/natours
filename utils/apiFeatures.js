class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A) Filtering
    const { pages, sort, limit, fields, ...searchParams } = this.queryString;
    // 1B) Advanced filtering
    let queryStr = JSON.stringify(searchParams);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //{difficulty:'easy',duration:{$gte:5}}
    //{difficulty:'easy', duration:{gte:5}}
    //gte,gt,lt,lte

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const { sort } = this.queryString;

    if (sort) {
      this.query = this.query.sort(sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    const { fields } = this.queryString;

    if (fields) {
      this.query = this.query.select(fields.split(',').join(' '));
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const { page, limit } = this.queryString;

    const npage = page * 1 || 1;
    const nlimit = limit * 1 || 100;
    const skip = (npage - 1) * nlimit;

    this.query = this.query.skip(skip).limit(nlimit);

    return this;
  }
}

module.exports = APIFeatures;
