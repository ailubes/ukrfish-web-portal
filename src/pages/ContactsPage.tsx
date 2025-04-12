
import { useState } from "react";
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ContactsPage = () => {
  const { toast } = useToast();
  
  // Form validation schema
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Ім'я повинно містити щонайменше 2 символи",
    }),
    email: z.string().email({
      message: "Введіть коректну email адресу",
    }),
    subject: z.string().min(5, {
      message: "Тема повинна містити щонайменше 5 символів",
    }),
    message: z.string().min(10, {
      message: "Повідомлення повинно містити щонайменше 10 символів",
    }),
  });

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, we would send this data to a backend
    
    toast({
      title: "Повідомлення надіслано",
      description: "Дякуємо за звернення! Ми зв'яжемося з вами найближчим часом.",
    });
    
    form.reset();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="Зв'язатися з нами"
          subtitle="Маєте питання чи пропозиції? Ми завжди готові до діалогу!"
        />

        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="section-title mb-6">Контактна інформація</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Телефон</h3>
                    <p className="text-gray-text">+380 44 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-text">info@ukrfish.org</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Адреса</h3>
                    <p className="text-gray-text">м. Київ, вул. Хрещатик, 10, офіс 205</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 mt-8 mb-4">Ми у соціальних мережах</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="section-title mb-6">Надіслати повідомлення</h2>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ім'я</FormLabel>
                            <FormControl>
                              <Input placeholder="Ваше ім'я" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="ваш@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тема</FormLabel>
                          <FormControl>
                            <Input placeholder="Тема вашого повідомлення" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Повідомлення</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Напишіть ваше повідомлення тут..." 
                              className="min-h-[150px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" /> Надіслати повідомлення
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16">
            <h2 className="section-title mb-6">Як нас знайти</h2>
            <div className="bg-gray-200 rounded-lg h-96 overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.5785838952987!2d30.519081476944022!3d50.44953308795566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce56b2456d13%3A0x5370464bfe5f32d4!2z0KXRgNC10YnQsNGC0LjQuiwg0JrQuNC10LIsIDAyMDAw!5e0!3m2!1suk!2sua!4v1682088091689!5m2!1suk!2sua" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта розташування"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactsPage;
