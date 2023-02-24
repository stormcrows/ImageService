export default {
  type: 'object',
  properties: {
    image: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['image', 'type'],
} as const;
