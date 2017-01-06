window.personType = {
  'name': 'Person',
  'displayName': 'A person resource',
  'type': ['Resource'],
  'required': true,
  'description': 'An object representing a person in the API. This object will be used in ' +
    'all methods returning a Person or list of persons.\n',
  'properties': {
    'id': {
      'name': 'id',
      'displayName': 'id',
      'type': ['string'],
      'required': true,
      'description': 'A unique identifier for a person. It is a 32 signs string containing' +
        ' alphanumeric characters.',
      'pattern': 'A-Za-Z0-9',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'type': {
            'insertedAsDefault': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      }
    },
    'name': {
      'name': 'name',
      'displayName': 'name',
      'type': ['string'],
      'example': 'John Smith',
      'required': true,
      'description': 'Person full name. The input will be rejected if this property is ' +
        'not set while creating new object.',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          }
        }
      },
      'structuredExample': {
        'value': 'John Smith',
        'strict': true,
        'name': null,
        'structuredValue': 'John Smith'
      }
    },
    'birthday': {
      'name': 'birthday',
      'displayName': 'birthday',
      'type': ['string'],
      'required': true,
      'description': 'The person\'s date of birth, represented as YYYY-MM-DD.',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      }
    },
    'gender': {
      'name': 'gender',
      'displayName': 'gender',
      'type': ['string'],
      'required': true,
      'description': 'The person\'s gender. Possible values include, but are not limited to, ' +
        'the following values:\n* \'male\' - Male gender.\n* \'female\' - Female gender.\n* ' +
        '\'other\' - Other.\n',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      }
    },
    'url': {
      'name': 'url',
      'displayName': 'url',
      'type': ['string'],
      'required': true,
      'description': 'The URL of this person\'s profile.',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      }
    },
    'image': {
      'name': 'image',
      'displayName': 'image',
      'type': ['Image'],
      'required': true,
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      },
      'properties': {
        'url': {
          'name': 'url',
          'displayName': 'url',
          'type': ['string'], 'required': true,
          'description': 'The URL of the person\'s profile photo. To resize the image and ' +
            'crop it to a square, append the query string **?sz=x**, where x is the ' +
            'dimension in pixels of each side.',
          '__METADATA__': {
            'primitiveValuesMeta': {
              'displayName': {
                'calculated': true
              },
              'required': {
                'insertedAsDefault': true
              }
            }
          }
        },
        '__METADATA__': {
          'primitiveValuesMeta': {
            'displayName': {
              'calculated': true
            },
            'required': {
              'insertedAsDefault': true
            }
          }
        }
      }
    },
    'tagline': {
      'name': 'tagline',
      'displayName': 'tagline',
      'type': ['string'],
      'required': true,
      'description': 'The brief description (tagline) of this person.',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      }
    },
    'language': {
      'name': 'language',
      'displayName': 'language',
      'type': ['string'],
      'required': true,
      'description': 'The user\'s preferred language for rendering.',
      '__METADATA__': {
        'primitiveValuesMeta': {
          'displayName': {
            'calculated': true
          },
          'required': {
            'insertedAsDefault': true
          }
        }
      }
    }
  },
  '__METADATA__': {
    'primitiveValuesMeta': {
      'required': {
        'insertedAsDefault': true
      }
    }
  }
};
window.headersDef = {
  'X-Paginated': {
    'name': 'X-Paginated',
    'displayName': 'X-Paginated',
    'type': [
      'string'
    ],
    'example': 'true',
    'required': true,
    'description': 'Required for paginated resources. It\'s value is always true.',
    '__METADATA__': {
      'primitiveValuesMeta': {
        'displayName': {
          'calculated': true
        }
      }
    },
    'structuredExample': {
      'value': 'true',
      'strict': true,
      'name': null,
      'structuredValue': 'true'
    }
  },
  'authorization': {
    'name': 'authorization',
    'displayName': 'authorization',
    'type': [
      'string'
    ],
    'required': true,
    'description': 'Used to send a valid OAuth 2 access token. Do not use with the ' +
      '"access_token" query string parameter.',
    '__METADATA__': {
      'primitiveValuesMeta': {
        'displayName': {
          'calculated': true
        }
      }
    },
    'structuredExample': {
      'value': 'true',
      'strict': true,
      'name': null,
      'structuredValue': 'true'
    }
  },
  'clientId': {
    'name': 'clientId',
    'displayName': 'clientId',
    'type': [
      'string'
    ],
    'example': 'id-from-console-project-number@domain.com',
    'required': true,
    'description': 'Project ID that can be obtained from developer console.',
    '__METADATA__': {
      'primitiveValuesMeta': {
        'displayName': {
          'calculated': true
        }
      }
    },
    'structuredExample': {
      'value': 'true',
      'strict': true,
      'name': null,
      'structuredValue': 'true'
    }
  }
};
window.uriParameters = {
  fileId: {
    description: 'The ID for the file in question.',
    name: 'fileId',
    required: true,
    type: [
      'string'
    ]
  }
};

window.queryParameters = {
  acknowledgeAbuse: {
    description: 'Whether the user is acknowledging the risk of downloading known malware ' +
      'or other abusive files. **Default to false**',
    example: 'true',
    name: 'acknowledgeAbuse',
    required: true,
    type: [
      'boolean'
    ]
  },
  projection: {
    description: 'This parameter is deprecated and has no function.\n\nAcceptable values are:' +
      '\n* "**BASIC**": Deprecated\n* "**FULL**": Deprecated',
    example: 'BASIC',
    name: 'projection',
    required: true,
    type: [
      'string'
    ]
  },
  revisionId: {
    description: 'Specifies the Revision ID that should be downloaded. Ignored unless ' +
      '__alt=media__ is specified.',
    pattern: '[a-zA-Z0-9]',
    example: 'qksi80a8asd9a0',
    name: 'revisionId',
    type: [
      'string'
    ]
  },
  fields: {
    description: 'Selector specifying which fields to include in a partial response.',
    example: 'editable,etag,fileExtension,fileSize,id,labels',
    name: 'fields',
    type: [
      'string'
    ]
  }
};
