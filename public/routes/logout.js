module.exports = function(app){
    //Log Out Route
    app.get('/logout',(req,res)=>{
        courses_error = 0;
        req.logout();
        res.redirect('/');
    });
}