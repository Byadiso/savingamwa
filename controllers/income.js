import  { errorHandler } from "../helper/dbErroHandler";
import  formidable from 'formidable';
import _  from 'lodash';
import fs from 'fs';
import Income from "../models/income";


exports.incomeById = (req,res, next, id ) =>{
    Income.findById(id)
    .populate('category')
    .populate('comments','text created')
    .populate('comments.createdBy','_id name')
    .exec((err, income)=>{
        if(err || !income){
            return res.status(400).json({
                error:" income not found"
            });
        }
        req.income = income;
        next();
    });
};

exports.read = (req,res )=>{
    req.income.photo = undefined;
    return res.json(req.income);
}

exports.list = (req, res )=>{
    let order = req.query.order ? req.query.order : 'asc' ;
    let sortBy = req.query.sortBy ? req.query.sortBy :'_id' ;
    let limit = req.query.limit ? parseInt(req.query.limit) : 6 ;    

    Income.find()
        .select('-photo')
        .populate('category')
        // .populate('comments','text created')
        .populate('comments.createdBy','_id name')
        // .populate('createdBy', '_id name')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) =>{
                if(err) {
                    return res.status(400).json({
                        error: "incomes not found"
                    });
                }
        res.status(200).json({
            properties: data,
            message: 'all properties',
            status: true
        })
    })
}

exports.listRelated = (req, res )=>{    
    let limit = req.query.limit ? parseInt(req.query.limit) : 4 ;
    Income.find({_id: {$ne: req.income}, category: req.income.category})
        .select('-photo')
        .limit(limit)
        .populate('category', '_id name')    
        .exec((err, incomes) =>{
        if(err) {
            return res.status(400).json({
                error: "incomes not found"
            });
        }
        res.json(incomes)
    })

}


exports.listCategories = (req, res )=>{
    Income.distinct('category', {}, (err, categories) =>{
        if(err) {
            return res.status(400).json({
                error: ' categories not found'
            });
        }
        res.json(categories)
    })
}


exports.listByUser = (req, res) => {
    Income.find({ createdBy: req.profile._id })
        .populate('createdBy', '_id name')
        .select('_id name description created shipping comments')
        .sort('_created')
        .exec((err, properties) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                properties: properties,
                message: `property by this user`
            });
        });
};


exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Income.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "incomes not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.create = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files )=>{
        if(err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        // check for all fields
        const {name, description, price, category, quantity, shipping } = fields
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: " All fields are required"
            })
        }

        let income = new Income(fields);
        income.createdBy = req.profile;
        if(files.photo){
            //validation of photo files
            if(files.photo.size> 3000000){
                return res.status(400).json({
                    error:"Image should be less than  3mb in size"
                })
            }
            income.photo.data = fs.readFileSync(files.photo.path)
            income.photo.contentType = files.photo.type
        }
        income.save((err, result)=>{
            if(err){
                return res.status(404).json({
                    error: errorHandler(err),
                    // error: err,
                    status: false
                });
            }
            res.json({
                property: result,
                status: true,
                message: 'Your property is created successful'
            });
        });
        
    });
};


exports.remove = (req, res)=>{
    let income = req.income;
    income.remove((err, deletedincome)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            // deletedincome, 
            message:"income deleted successfully",
            status:true
        })
    })
}




exports.update = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        // check for all fields
        // const {name, description, price, category, quantity, shipping } = fields
        // if(!name || !description || !price || !category || !quantity || !shipping) {
        //     return res.status(400).json({
        //         error: " All fields are required"
        //     })
        // }

        let income = req.income;
        income = _.extend(income, fields)
        if(files.photo){
            //validation of photo files
            if(files.photo.size> 3000000){
                return res.status(400).json({
                    error:"Image should be less than  3mb in size"
                })
            }
            income.photo.data = fs.readFileSync(files.photo.path)
            income.photo.contentType = files.photo.type
        }
        income.save((err, result)=>{
            if(err){
                return res.status(404).json({
                    error: errorHandler(err),
                    status:false
                });
            }
            res.json({
                property: result,
                status:true,
                message: 'Your property has been Updated successfull'
            });
        });
        
    });
};


exports.photo = (req, res, next )=>{
    if(req.income.photo){
        res.set('Content-Type', req.income.photo.contentType);
        return res.send(req.income.photo.data);
    }
    next();
}



exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assign category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the income based on query object with 2 properties
        // search and category
        Income.find(query, (err, incomes) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(incomes);
        }).select('-photo');
    }
};




exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.incomes.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Income.bulkWrite(bulkOps, {}, (error, incomes) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update income'
            });
        }
        next();
    });
};
