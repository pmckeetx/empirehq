var express = require( 'express' );
var mongo = require( 'promised-mongo' ).compatible();
var util = require( 'util' );

module.exports.init = function( app, config ) {
    
    config      = config || {};
    config.uri  = config.uri || '/api';

    config.db           = config.db || {};
    config.db.host      = config.db.host || 'localhost';
    config.db.port      = config.db.port || 27017;
    config.db.database  = config.db.database || 'rest_default';
    config.db.username  = config.db.username || null;
    config.db.password  = config.db.password || null;

    //
    //  Connect to MongoDB
    //
    var connstr = 'mongodb://';

    if( config.db.username && config.db.password ) {
        connstr += config.db.username +':'+ config.db.password +'@';
    }

    connstr += config.db.host +':'+ config.db.port +'/'+ config.db.database;

    //'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]'
    var db = mongo( connstr );
    var collections = [];

    //
    //  Read
    //
    app.get( config.uri +"/:entity", function( req, res ) {
        var collection = collections[ req.params.entity ] || db.collection( req.params.entity );

        collection.find().then(
            function( docs ) {
                return res.json( {
                    status: 1,
                    message: "success",
                    data: docs
                } );
            },
            function( reason ) {
                return res.json( {
                    status: 0,
                    message: "error",
                    data: reason
                } );
            }
        ).done();

    });
    
    app.get( config.uri +"/:entity/:id", function( req, res ) {
        var collection = collections[ req.params.entity ] || db.collection( req.params.entity );

        collection.find({ _id: mongo.ObjectId( req.params.id ) }).then(
            function( docs ) {
                return res.json( {
                    status: 1,
                    message: "success",
                    data: docs[0]
                } );
            },
            function( reason ) {
                return res.json( {
                    status: 0,
                    message: "error",
                    data: reason
                } );
            }
        ).done();

    });
    
    // app.get( config.uri +"/:entity/:id/:subentity", function( req, res ) {
    //     if( !req.query.q ) {
    //         var query = "{\""+ req.params.entity +"_id\": \""+ req.params.id +"\"}";
    //         query = JSON.parse( query );

    //         app.Store.find( req.params.subentity, query, function( err, data ) {
    //             if( !err ) {
    //                 res.json({
    //                     status: 1,
    //                     message: "success",
    //                     data: data
    //                 });
    //             } else {
    //                 res.json({
    //                     status: 0,
    //                     message: "error",
    //                     data: err
    //                 });
    //             }
    //         });
    //     } else {
    //         var query = JSON.parse( req.query.q );
    //         query[ req.params.entity +"_id" ] = req.params.id;

    //         app.Store.find( req.params.subentity, query, function( err, data ) {
    //             if( !err ) {
    //                 res.json({
    //                     status: 1,
    //                     message: "success",
    //                     data: data
    //                 });
    //             } else {
    //                 res.json({
    //                     status: 0,
    //                     message: "error",
    //                     data: err
    //                 });
    //             }
    //         });
    //     }
    // });
    // app.get( config.uri +"/:entity/:id/:subentity/:sid", function( req, res ) {
    //     app.Store.findById( req.params.subentity, req.params.sid, function( err, data ) {
    //         if( !err ) {
    //             res.json({
    //                 status: 1,
    //                 message: "success",
    //                 data: data
    //             });
    //         } else {
    //             res.json({
    //                 status: 0,
    //                 message: "error",
    //                 data: err
    //             });
    //         }
    //     });
    // });

    //
    //  Create
    //
    app.post( config.uri+ "/:entity", function( req, res ) {
        var collection = collections[ req.params.entity ] || db.collection( req.params.entity );

        collection.insert( req.body ).then(
            function( doc ) {
                return res.json( {
                    status: 1,
                    message: "success",
                    data: doc
                } );
            },
            function( reason ) {
                return res.json( {
                    status: 0,
                    message: "error",
                    data: reason
                } );
            }
        ).done();

    });

    //
    // Update
    //
    app.put( config.uri +"/:entity", function( req, res ) {
        res.json({
            status: 0,
            message: "method not implemented.",
            data: null
        });
    });
    
    app.put( config.uri +"/:entity/:id", function( req, res ) {
        var collection = collections[ req.params.entity ] || db.collection( req.params.entity );

        var doc = req.body;
        doc._id = mongo.ObjectId( req.params.id );

        collection.save( doc ).then(
            function( updatedDoc ) {
                return res.json( {
                    status: 1,
                    message: "success",
                    data: updatedDoc
                } );
            },
            function( reason ) {
                console.log( 'reason: '+ reason );
                return res.json( {
                    status: 0,
                    message: "error",
                    data: reason
                } );
            }
        ).done();

    });

    // //
    // //  Delete
    // //
    // app.delete( config.uri +"/:entity", function( req, res ) {
    //     res.json({
    //         status: 0,
    //         message: "method not implemented.",
    //         data: null
    //     });
    // });
    
    // app.delete( config.uri +"/:entity/:id", function( req, res ) {

    //     app.Store.removeById( req.params.entity, req.params.id, function( err, data ) {
    //         if( !err ) {
    //             res.json({
    //                 status: 1,
    //                 message: "success",
    //                 data: data
    //             });
    //         } else {
    //             res.json({
    //                 status: 0,
    //                 message: "error",
    //                 data: err
    //             });
    //         }
    //     });
    // });

    return app;
}



















