'use client';

import { useState } from 'react';
import slugify from 'slugify';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Typography from '@/components/ui/typography';
import { useCreateWorkspaceValues } from '@/hooks/create-workspace-values';
import { createWorkspace } from '@/actions/create-workspace';
import { useRouter } from 'next/navigation';

const CreateWorkspace = () => {
  const { currStep } = useCreateWorkspaceValues();

  let stepInView = null;

  switch (currStep) {
    case 1:
      stepInView = <Step1 />;
      break;
    case 2:
      stepInView = <Step2 />;
      break;
    default:
      stepInView = <Step1 />;
  }

  return (
    <div className='w-screen h-screen grid place-content-center bg-neutral-800 text-white'>
      <div className='p-3 max-w-[550px]'>
        <Typography
          text={`step ${currStep} of 2`}
          variant='p'
          className='text-neutral-400'
        />

        {stepInView}
      </div>
    </div>
  );
};

export default CreateWorkspace;

const Step1 = () => {
  const { name, updateValues, setCurrStep } = useCreateWorkspaceValues();

  return (
    <>
      <Typography
        text="Create Your League"
        className="text-2xl font-bold text-center text-gray-800 mb-4"
      />

      <Typography
        text="Give your league a unique name that your team will recognize."
        className="text-gray-600 text-center mb-6"
        variant="p"
      />

      <form className="space-y-6">
        <fieldset>
          <Input
            className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3 w-full"
            type="text"
            value={name}
            placeholder="Enter your league name"
            onChange={(event) => updateValues({ name: event.target.value })}
          />
        </fieldset>

        <Button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          onClick={() => setCurrStep(2)}
          disabled={!name}
        >
          Next Step
        </Button>
      </form>
    </>
  );
};

const Step2 = () => {
  const { setCurrStep, updateImageUrl, imageUrl, name } =
    useCreateWorkspaceValues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const slug = slugify(name);
    const invite_code = uuid();
    const error = await createWorkspace({ imageUrl, name, slug, invite_code });
    setIsSubmitting(false);
    if (error?.error) {
      console.log(error);
      return toast.error("Couldn't create workspace. Please try again.");
    }
    toast.success('Workspace created successfully');
    router.push('/');
  };

  return (
    <>
      <Button
        size="sm"
        className="text-blue-600 hover:underline mb-4"
        variant="link"
        onClick={() => setCurrStep(1)}
      >
        Back
      </Button>

      <form>
        <Typography
          text="Upload League Image"
          className="text-2xl font-bold text-center text-gray-800 mb-4"
        />
        <Typography
          text="This image will represent your league and can be changed later."
          className="text-gray-600 text-center mb-6"
          variant="p"
        />

        <fieldset
          disabled={isSubmitting}
          className="flex flex-col items-center space-y-9"
        >
          <ImageUpload />
          <div className="space-x-5">
            <Button
              onClick={() => {
                updateImageUrl('');
                handleSubmit();
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Skip for Now
            </Button>

            {imageUrl ? (
              <Button
                type="button"
                onClick={handleSubmit}
                size="sm"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create League
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Select an Image
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
};
