const { z } = require('zod');

const partnerSchema = z.object({
  alias: z.string().min(1, 'L\'alias est requis'),
  type: z.string().min(1, 'Le type est requis'),
  direction: z.enum(['INBOUND', 'OUTBOUND'], {
    errorMap: () => ({ message: 'La direction doit être INBOUND ou OUTBOUND' })
  }),
  application: z.string().optional(),
  processed_flow_type: z.enum(['MESSAGE', 'ALERTING', 'NOTIFICATION'], {
    errorMap: () => ({ message: 'Le type de flux doit être MESSAGE, ALERTING ou NOTIFICATION' })
  }),
  description: z.string().min(1, 'La description est requise')
});

const validateCreate = (data) => {
  return partnerSchema.parse(data);
};

const validateUpdate = (data) => {
  return partnerSchema.partial().parse(data);
};

module.exports = {
  validateCreate,
  validateUpdate
}; 