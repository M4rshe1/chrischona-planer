const Loading = () => {
    return (
        <main className="flex h-full flex-col justify-between p-24">
            <div>
                <h1 className="text-2xl font-bold text-center">Loading</h1>
                <progress className="progress progress-primary w-72" />
            </div>
        </main>
    );
}

export default Loading;