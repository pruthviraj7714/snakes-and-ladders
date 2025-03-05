import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Dice5, Users, Trophy, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dice5 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SnakeBid</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-to-play"
              className="text-sm font-medium hover:text-primary"
            >
              How to Play
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/api/auth/signin/github"
              className="text-sm font-medium hover:text-primary hidden md:block"
            >
              Sign In
            </Link>
            <form
              action={async () => {
                "use server";
                await signIn("github", {
                  callbackUrl: "/home",
                });
              }}
            >
              <Button type="submit">
                <Github className="mr-2 h-4 w-4" />
                Login with GitHub
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Play Snakes & Ladders with Real Stakes
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create rooms, set your bid, and challenge players from
                    around the world in the classic game of luck and strategy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/api/auth/signin/github">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Start Playing Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-to-play">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full min-[400px]:w-auto"
                    >
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
                <Image
                  src="https://i.pinimg.com/736x/50/f7/97/50f797b19bad2c5edc2c248bef9fb6fe.jpg"
                  width={550}
                  height={550}
                  alt="Snakes and Ladders Game Board"
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Game Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need for Exciting Gameplay
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a modern take on the classic Snakes and
                  Ladders game with competitive bidding and real-time
                  multiplayer.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <Coins className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Custom Bidding</h3>
                <p className="text-center text-muted-foreground">
                  Create rooms with your own bid amount and play for real
                  stakes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multiplayer Rooms</h3>
                <p className="text-center text-muted-foreground">
                  Play with friends or match with random players from around the
                  world.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Leaderboards</h3>
                <p className="text-center text-muted-foreground">
                  Compete for the top spot on our global leaderboards and earn
                  rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-to-play" className="py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How to Play
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Getting started is easy. Follow these simple steps to jump
                  into the action.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Sign In</h3>
                <p className="text-center text-muted-foreground">
                  Login with your GitHub account to access all game features.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Create or Join a Room</h3>
                <p className="text-center text-muted-foreground">
                  Set your bid amount when creating a room or join an existing
                  one.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Play and Win</h3>
                <p className="text-center text-muted-foreground">
                  Roll the dice, navigate the board, and be the first to reach
                  the end to win the pot.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Ready to Play?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join thousands of players already enjoying SnakeBid
                </h2>
                <Link href="/api/auth/signin/github">
                  <Button size="lg" className="mt-4">
                    <Github className="mr-2 h-4 w-4" />
                    Login with GitHub
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Our platform is growing fast with players from all over the
                  world. Join now and experience the thrill of Snakes and
                  Ladders with real stakes.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm text-muted-foreground">
                      Active Players
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm text-muted-foreground">
                      Games Played
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">$100K+</div>
                    <div className="text-sm text-muted-foreground">
                      Total Winnings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Dice5 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SnakeBid</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SnakeBid. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
