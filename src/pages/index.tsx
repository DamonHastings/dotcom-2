import Head from 'next/head';
import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import { IconGithub, IconMail } from '@/components/icons';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home — Portfolio</title>
        <meta name="description" content="Portfolio site" />
      </Head>
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Avatar alt="Damon Hastings" size={64} />
            <div>
              <h1 className="text-3xl font-bold">Damon Hastings</h1>
              <p className="text-sm text-muted-foreground">Software engineer — Frontend & product</p>
            </div>
          </div>

          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This starter portfolio includes a small component library and an example contact form.
            </p>
            <div className="flex gap-3">
              <Button>
                <IconGithub className="w-4 h-4 mr-2 inline" /> View code
              </Button>
              <Button variant="secondary">
                <IconMail className="w-4 h-4 mr-2 inline" /> Contact
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium mb-3">Contact</h3>
            <form className="space-y-3">
              <Input label="Name" name="name" />
              <Input label="Email" type="email" name="email" />
              <Textarea label="Message" name="message" />
              <div>
                <Button type="submit">Send message</Button>
              </div>
            </form>
          </Card>
        </section>
      </main>
    </>
  );
}
