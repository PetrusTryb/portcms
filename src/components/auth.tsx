import { LockClosedIcon } from '@heroicons/react/solid'
export type AuthProps = {
    id: string,
    type: "auth",
    data: {
        title: string,
        logo?: string,
        mode: "register" | "login" | "reset",
        disableLogin?: boolean,
        disableRegister?: boolean,
        disablePasswordReset?: boolean,
    }
}
export default function Auth(Props: AuthProps) {
    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-700">
                <div className="max-w-2xl w-full space-y-8">
                    <div>
                        {Props.data.logo && (
                            <img
                                className="mx-auto h-12 w-auto"
                                src={Props.data.logo}
                                alt="Logo"
                            />
                        )}
                        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-gray-200">{Props.data.title}</h2>
                        {Props.data.mode === "register" && !Props.data.disableLogin && (
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                            Have an account?{' '}
                            <a href="/cms/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                                Sign in
                            </a>
                        </p>
                        )}
                        {Props.data.mode === "login" && !Props.data.disableRegister && (
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                                Don't have an account?{' '}
                                <a href="/cms/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                                    Register now!
                                </a>
                            </p>
                        )}
                    </div>
                    <form className="mt-8 space-y-6" action="/api/auth" method="POST">
                        <input type="hidden" name="mode" value={Props.data.mode} />
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    maxLength={100}
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
