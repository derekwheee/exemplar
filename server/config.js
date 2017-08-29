module.exports = {
    USE_SSL : !process.env.NODE_ENV || process.env.NODE_ENV !== 'production',
    DEFAULT_PORT : 3000,
    STATIC_PATH : './www',
    VIEWS_PATH : './www/views',
}