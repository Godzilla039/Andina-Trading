const mainView = (req, res)=>{
    res.render('home')
}

const tables = (req, res)=>{
    res.render('tables')
}

const notificationsUser = (req, res)=>{
    res.render('notifications')
}

const heatMap = (req, res)=>{
    res.render('heatmap')
}

const news = (req, res)=>{
    res.render('news')
}

module.exports = {
    mainView,
    tables,
    notificationsUser,
    heatMap,
    news
}