var _ = require( "underscore" );
var util = require( "util" );

var mongo = require('mongodb');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DocumentStore = function( host, port, name, username, password ) {
    this.db = new Db( name, new Server( host, port, {auto_reconnect: true} ), {safe:true} );
    this.db.open( function( err, data ){
        this.isConnected = true;
        if( err ) {
            console.log( "An error occured trying to connect to the database." );
            console.log( "host: "+ host );
            console.log( "post: "+ port );
            console.log( "name: "+ name );
            console.log( "username: "+ username );
            console.log( "password: "+ password );
            console.log( err );
            
            this.isConnected = false;
        }
        
        if( data ){
            if( username ) {
                data.authenticate( username, password, function( err2, data2 ) {
                    if( data2 ) {
                        console.log( "Database opened" );
                    } else {
                        console.log( err2 );
                    }
                });
            }
        }
    });
};

DocumentStore.prototype.getCollection= function( collectionName, callback ) {
    this.db.collection( 
        collectionName, 
        function( error, collection ) {
            if( error ) {
                callback( error );
            } else {
                callback( null, collection );
            }
        }
    );
};

DocumentStore.prototype.findAll = function( collectionName, callback ) {
    this.getCollection( 
        collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                collection.find().toArray( function( error, results ) {
                    if( error ) 
                        callback( error );
                    else 
                        callback( null, results );
                });
            }
        }
    );
};

DocumentStore.prototype.findById = function( collectionName, id, callback ) {
    this.getCollection(
         collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                collection.findOne({
                    _id: collection.db.bson_serializer.ObjectID.createFromHexString(id)
                }, function( error, result ) {
                    if( error ) 
                        callback( error );
                    else 
                        callback( null, result );
                });
            }
        }
    );
};

DocumentStore.prototype.findByIds = function( collectionName, ids, callback ) {
    this.getCollection(
         collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                var objectIds = [];
                
                _.each( ids, function( id ) { 
                    var x = collection.db.bson_serializer.ObjectID.createFromHexString( id ) ;
                    objectIds.push( x );
                });
                
                var query = {
                    "_id": {
                        $in: objectIds
                    }
                };
                
                var cursor = collection.find( query );
                
                cursor.toArray(function( error, result ) {
                    if( error ) {
                        callback( error );
                    }
                    else {
                        callback( null, result );
                    }
                });
            }
        }
    );
}

DocumentStore.prototype.find = function( collectionName, query, callback ) {
    this.getCollection(
         collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                var cursor = collection.find( query );
                
                cursor.toArray(function( error, result ) {
                    if( error ) {
                        callback( error );
                    }
                    else {
                        callback( null, result );
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.findWithSort = function( collectionName, query, sort, limit, callback ) {
    if( limit && typeof limit === "function" ) {
        callback = limit;
        limit = 10;
    }

    this.getCollection(
         collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                var cursor;
                cursor = collection.find( query ).limit( limit ).sort( sort );
                
                cursor.toArray(function( error, result ) {
                    if( error ) {
                        callback( error );
                    }
                    else {
                        callback( null, result );
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.findWithSortSkip = function( collectionName, query, sort, docId, limit, callback ) {
    this.getCollection(
         collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                var cursor;
                if (docId) {
                    cursor = collection.find( query ).sort( sort );
                    docId = collection.db.bson_serializer.ObjectID.createFromHexString( docId ) ;
                } else {
                    cursor = collection.find( query ).sort( sort ).limit( limit );
                }
                
                cursor.toArray(function( error, result ) {
                    if( error ) {
                        callback( error );
                    } else {
                        var topIdx = 0;
                        if (docId) {
                            for(var i = 0;i < result.length;i++) {
                                if (docId.equals(result[i]._id)) {
                                    topIdx = i+1;
                                    break;
                                }
                            }
                            console.info("result.size=" + result.length + ", top=" + topIdx + ", bottom=" + (topIdx + limit -1));
                            callback( null, result.splice(topIdx, limit));
                        } else {
                            callback( null, result );
                        }
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.count = function( collectionName, query, callback ) {
    this.getCollection(
         collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error )
            } else {
                var cursor = collection.find( query );
                
                cursor.count(function( error, result ) {
                    if( error ) {
                        callback( error );
                    }
                    else {
                        callback( null, result );
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.group = function( collectionName, key, condition, reduce, initial, callback ) {
    this.getCollection(
        collectionName,
        function( error, collection ) {
            if (error) {
                callback( error )
            } else {
                collection.group(key, condition, initial, reduce, function(error, results){
                    if (error) {
                        callback( error );
                    } else {
                        callback (null, results);
                    }
                });
            }
        }
    );
}

DocumentStore.prototype.save = function(  collectionName, documents, callback ) {
    this.getCollection( 
        collectionName, 
        function( error, collection ) {
            if( error ) 
                callback( error );
            else {
                if( typeof( documents.length ) == "undefined" )
                    documents = [documents];

                for( var i = 0; i < documents.length; i++ ) {
                    documents = documents[ i ];
                    documents.created_at = new Date();
                }

                collection.insert( documents, function() {
                    callback( null, documents );
                });
            }
        }
    );
};

/// This is really a replace
DocumentStore.prototype.update = function(  collectionName, criteria, document, callback ) {
    this.getCollection( 
        collectionName, 
        function( error, collection ) {
            if( error ) {
                callback( error );
            } else {
                var orgId = null;
                if( criteria._id !== undefined ) {
                    orgId = criteria._id;
                    criteria._id = collection.db.bson_serializer.ObjectID.createFromHexString(criteria._id)
                    delete document._id;
                }
                collection.update( criteria, { $set: document }, { safe: true }, function( err ) {
                    if( err ) {
                        callback( err );
                    } else {                    
                        if( criteria._id !== undefined ) {
                            document._id = orgId;
                        }
                        callback( null, document );
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.updater = function( collectionName, criteria, query, options, callback ) {
    this.getCollection( collectionName, function( error, collection ) {
        if( error ) {
            callback( error )
        } else {
            if( criteria._id !== undefined ) {
                criteria._id = collection.db.bson_serializer.ObjectID.createFromHexString(criteria._id)
            }
            // switch to findAndModify, which returns the ORIGINAL object
            collection.findAndModify( criteria, [['_id', 'asc']],query, options, function( error, obj  ) {
                if( error ) {
                    callback( error );
                } else {
                    callback( null, obj );
                }
            });
        }
    })
};

DocumentStore.prototype.modify = function(  collectionName, criteria, document, callback ) {
    this.getCollection(
        collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error );
            } else {
                collection.update( criteria, document, { safe: true }, function( err ) {
                    if( err ) {
                        callback( err );
                    } else {                    
                        callback( null );
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.removeById = function(  collectionName, id, callback ) {
    var document = {};
    this.getCollection( 
        collectionName, 
        function( error, collection ) {
            console.log( '** collection: '+ ( collection == null ? false : true ) );
            console.log( '** error: '+ error );

            if( error ) {
                callback( error );
            } else {
                var criteria = {
                    _id: collection.db.bson_serializer.ObjectID.createFromHexString( id )
                };
                
                collection.remove( criteria, { remove: true }, function( err ) {
                    if( err ) {
                        callback( err );
                    } else {
                        callback( null );
                    }
                });
            }
        }
    );
};

DocumentStore.prototype.remove = function(  collectionName, criteria, callback ) {
    var document = {};
    this.getCollection(
        collectionName,
        function( error, collection ) {
            if( error ) {
                callback( error );
            } else {
                collection.remove( criteria, { remove: true }, function( err ) {
                    if( err ) {
                        callback( err );
                    } else {
                        callback( null );
                    }
                });
            }
        }
    );
};

exports.DocumentStore = DocumentStore;