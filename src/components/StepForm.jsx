import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { StepIcon, StepIconSave } from './StepIcons'
import ParticleBackground from './ParticleBackground'

/**
 * StepForm renders the dynamic fields for a selected step using Formik + Yup.
 * Validation rules are inferred from field types and common field names.
 */
export default function StepForm({ step, initialData = {}, onSave }){
  if(!step){
    return (
      <div className="card p-8 text-center border-primary-100/30 shadow-sm rounded-xl">
        <p className="text-sm text-slate-500">
          Click on any step on the left to capture its details.
        </p>
        <p className="text-xs text-slate-400 mt-1">Select a process step to open the form</p>
      </div>
    )
  }

  const initialValues = {}
  step.fields.forEach(f => {
    initialValues[f.name] = initialData[f.name] ?? ''
  })

  const shape = {}
  step.fields.forEach(f => {
    const name = f.name
    const type = (f.type || '').toLowerCase()
    const requiredIfImportant = /clientname|filereference|bookingnumber|bkmessrs|bkmessrsagent|portofload|portofdischarge/i.test(name)

    if(type === 'email' || /email/i.test(name)){
      shape[name] = Yup.string().email('Invalid email address')
      if(requiredIfImportant) shape[name] = shape[name].required('Required')
    } else if(type.includes('date') || /date/i.test(name)){
      shape[name] = Yup.date().typeError('Invalid date').nullable()
    } else if(f.type === 'textarea'){
      shape[name] = Yup.string().max(2000, 'Too long')
      if(requiredIfImportant) shape[name] = shape[name].required('Required')
    } else {
      shape[name] = Yup.string().max(500, 'Too long')
      if(requiredIfImportant) shape[name] = shape[name].required('Required')
    }
  })

  const validationSchema = Yup.object().shape(shape)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        onSave(values)
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="card p-5 sm:p-6 transition-shadow duration-300 hover:shadow-md relative overflow-hidden border-primary-100/40 shadow-md" aria-labelledby="step-title">
          <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4 pb-4 border-b border-slate-200/80">
            <div className="min-w-0 flex gap-3">
              <span className="text-primary-500 shrink-0 mt-0.5">
                <StepIcon step={step} className="w-6 h-6" />
              </span>
              <div>
                <h2 id="step-title" className="text-lg font-bold text-slate-800">
                  {step.title}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 shrink-0 inline-flex items-center gap-2 transition-all duration-300 hover:bg-primary-100/80">
              <StepIcon step={step} className="w-4 h-4" />
              {step.tag}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {step.fields.map(f => {
              const required = /clientname|filereference|bookingnumber|bkmessrs|bkmessrsagent|portofload|portofdischarge/i.test(f.name)
              return (
                <div key={f.name} className="flex flex-col min-w-0 gap-2">
                  <label className="text-sm font-medium text-slate-600 min-h-[1.25rem] flex items-start gap-1 break-words" htmlFor={f.name}>
                    <span className="leading-tight">{f.label}</span>
                    {required && <span className="text-red-500 shrink-0" aria-hidden>*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <Field
                      as="textarea"
                      id={f.name}
                      name={f.name}
                      aria-required={required}
                      className="input-base min-h-[84px] resize-y w-full"
                    />
                  ) : (
                    <Field
                      id={f.name}
                      name={f.name}
                      type={f.type || 'text'}
                      aria-required={required}
                      className="input-base h-10 w-full"
                    />
                  )}
                  <ErrorMessage name={f.name} component="div" className="text-sm text-red-600 mt-0.5" />
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="btn-primary inline-flex items-center gap-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
            >
              <StepIconSave />
              Save Step Details
            </button>
            <span className="text-sm text-primary-600 sr-only">Saved status will show here</span>
          </div>
        </Form>
      )}
    </Formik>
  )
}
