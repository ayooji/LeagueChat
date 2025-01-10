"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { registerWithEmail } from "@/actions/register-with-email";

const AuthPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getCurrUser = async () => {
      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession();

      if (session) {
        router.push("/");
      } else {
        supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
          if (session) {
            router.push("/");
          }
        });
      }
    };

    getCurrUser();
    setIsMounted(true);
  }, [router]);

  const formSchema = z.object({
    email: z.string().email().min(2, { message: "Email must be 2 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAuthenticating(true);
    const response = await registerWithEmail(values);
    const { data, error } = JSON.parse(response);
    setIsAuthenticating(false);

    if (error) {
      console.warn("Sign in error", error);
      return;
    }

    // Show confirmation message
    setShowConfirmation(true);

    // Hide the confirmation after 5 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 5000);
  }

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-5">
      {showConfirmation && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <div className="absolute bg-white text-center p-6 rounded-lg shadow-lg">
            <Typography
              text="Magic Link Sent!"
              variant="h2"
              className="text-primary mb-2"
            />
            <Typography
              text="Check your email and click the Magic Link to log in."
              variant="p"
              className="text-gray-600"
            />
            <Button
              className="bg-primary text-white mt-4"
              onClick={() => setShowConfirmation(false)}
            >
              Got it!
            </Button>
          </div>
        </>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full shadow-black/10">
        {/* Logo Card */}
        <div className="flex justify-center mb-8 relative">
          <div className="bg-gradient-to-br from-blue-500 to-green-500 p-1 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-white rounded-full p-1">
              <Image
                src="/leaguechat_logo.jpg"
                alt="LeagueChat Logo"
                width={256}
                height={256}
                className="w-64 h-auto rounded-full transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <Typography
          text="Welcome to LeagueChat"
          variant="h2"
          className="text-center text-primary mb-4 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text"
        />

        <Typography
          text="Powering Your Fantasy Football Conversations!"
          variant="p"
          className="text-gray-600 text-center mb-6"
        />

        {/* Sign-In Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isAuthenticating}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-gray-100 border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="secondary"
                className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 mx-auto mt-6 block"
                type="submit"
              >
                <Typography
                  text="Send Magic Link"
                  variant="p"
                  className="text-sm font-medium"
                />
              </Button>
            </fieldset>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Typography
            text="After submitting, check your email for a Magic Link to log in."
            variant="p"
            className="text-gray-500 mb-2"
          />

          <a href="mailto:support@leagueChat.com" className="text-primary">
            support@leagueChat.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
