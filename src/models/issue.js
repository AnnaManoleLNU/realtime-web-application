/**
 * Mongoose model Issue.
 *
 * @author Anna Manole
 * @version 1.0.0
 */

import mongoose from 'mongoose'

/**
 *
 */
// export class Issue {
//   /**
//    * Creates an instance of Issue.
//    *
//    * @param {string} title - The title of the issue.
//    * @param {string} description - The description of the issue.
//    * @param {string} image - The image of the issue.
//    * @param {boolean} done - The status of the issue.
//    *
//    */
//   constructor (title, description, image, done) {
//     this.title = title
//     this.description = description
//     this.image = image
//     this.done = done
//   }
// }

// Create a schema.
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  done: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Issue = mongoose.model('Issue', schema)
