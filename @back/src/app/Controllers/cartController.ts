const cartController = {
    index(req, res){
        res.json({
            message: 'GreenRoots API Server GET "/api/cart"',
            version: '1.0.0',
            status: '200'
        });
    },

    create(req, res){
        res.json({
            message: 'GreenRoots API Server POST "/api/cart"',
            version: '1.0.0',
            status: '200'
        })
    },

    update(req, res){
        res.json({
            message: 'GreenRoots API Server PUT "/api/cart/:itemID"',
            version: '1.0.0',
            status: '200'
        })
    },

    delete(req, res){
        res.json({
            message: 'GreenRoots API Server DELETE "/api/cart/:itemID"',
            version: '1.0.0',
            status: '200'
        })
    }
}

export { cartController };
