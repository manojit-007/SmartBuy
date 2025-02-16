class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    // Apply search filter (case insensitive search on product name)
    search() {
      if (this.queryStr.keyword) {
        this.query = this.query.find({
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // Case insensitive search
          }
        });
      }
      return this;
    }
  
    // Apply filters based on other query params (price, etc.)
    filter() {
      const queryCopy = { ...this.queryStr };
      const removeFields = ["keyword", "page", "limit"]; // Remove non-filterable fields
      removeFields.forEach(key => delete queryCopy[key]);
  
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); // Format for MongoDB queries
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    // Apply pagination to the query (limit and skip)
    pagination(itemNoPerPage) {
      const currentPage = Number(this.queryStr.page) || 1; // Default to page 1 if no page is provided
      const skip = itemNoPerPage * (currentPage - 1);
      this.query = this.query.limit(itemNoPerPage).skip(skip);
      return this;
    }
  }
  
  module.exports = ApiFeatures;
  