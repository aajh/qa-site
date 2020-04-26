declare module 'db-migrate' {
    interface Api {
        registerAPIHook: () => Promise<void>
        run: () => void
        up: (specification?: string | number, scope?: string) => Promise<void>
        down: (specification?: string | number, scope?: string) => Promise<void>
        sync: (specification?: string | number, scope?: string) => Promise<void>
        reset: (scope?: string) => Promise<void>
        silence: (isSilent: boolean) => void
        transition: () => void
        create: (migrationName: string, scope?: string) => Promise<void>
        createDatabse: (dbname: string) => Promise<void>
        dropDatabase: (dbname: string) => Promise<void>
    }

    interface GetInstanceOptions {
        cwd?: string
        config?: string | object
        cmdOptions?: string
        env?: string
        throwUncatched?: boolean
    }
    function getInstance(isModule?: boolean, options?: GetInstanceOptions): Api;
}
