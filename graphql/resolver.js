import {Note} from '../models/Note';
import {User} from '../models/User';

export const resolvers = {
    Query: {
        notes: async (_, args) => {
            const filter = {};

            if (args.userId) {
                filter.owner = args.userId;
            }

            if (args.title) {
                filter.title = { $regex: args.title, $options: 'i' };
            }

            if (args.startDate || args.endDate) {
                filter.createdAt = {};
                if (args.startDate) {
                    filter.createdAt.$gte = new Date(args.startDate);
                }
                if (args.endDate) {
                    filter.createdAt.$lte = new Date(args.endDate);
                }
            }

            const notes = await Note.find(filter)
                .sort({ createdAt: -1 })
                .skip(args.skip || 0)
                .limit(args.limit || 10)
                .populate('owner');

            return notes;
        },
    },
    Note: {
        owner: async (note) => {
            return await User.findById(note.owner);
        },
    },
};
