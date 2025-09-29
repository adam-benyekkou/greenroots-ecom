const authController = {
    login(req, res){
        res.json({
            message: 'GreenRoots API Server POST "/api/login"',
            version: '1.0.0',
            status: '200'
        });
    },

    logout(req, res){
        res.json({
            message: 'GreenRoots API Server POST "/api/logout"',
            version: '1.0.0',
            status: '200'
        });
    },

    register(req, res){
        res.json({
            message: 'GreenRoots API Server POST "/api/register"',
            version: '1.0.0',
            status: '200'
        });
    }
}


export { authController };
