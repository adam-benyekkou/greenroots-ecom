const adminController = {

    create(req, res){
        res.json({
            message: 'GreenRoots API Server POST "api/admin/trees/:id"',
            version: '1.0.0',
            status: '200'
        });
    },

    update(req, res){
        res.json({
            message: 'GreenRoots API Server PUT "api/admin/trees/:id"',
            version: '1.0.0',
            status: '200'
        });
    },

    delete(req, res){
        res.json({
            message: 'GreenRoots API Server DELETE "api/admin/trees/:id"',
            version: '1.0.0',
            status: '200'
        });
    },
}

export { adminController };
