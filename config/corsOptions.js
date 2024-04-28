const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["POST", "GET", "PUT", "DELETE, PATCH"],
  exposedHeaders: ["Content-Type"],
};

module.exports = corsOptions;
