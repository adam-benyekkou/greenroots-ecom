const ordersController = {
    index(req, res){
        res.json({
            message: 'GreenRoots API Server GET "/api/orders"',
            version: '1.0.0',
            status: '200'
        });
    },

    show(req, res){
        res.json({
            message: 'GreenRoots API Server GET "/api/orders/:id"',
            version: '1.0.0',
            status: '200'
        });
    },

    create(req, res){
        res.json({
            message: 'GreenRoots API Server POST "/api/orders"',
            version: '1.0.0',
            status: '200'
        });
    }
}

export { ordersController };
