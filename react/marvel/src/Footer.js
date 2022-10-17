function Footer(data) {
    let wrapStyle = {
        'backgroundColor': 'rgba(0, 0, 0, 0.2)'
    }
    return (
        <div>
            <div>
                <div className="text-center p-3" style={wrapStyle}>
                    <div dangerouslySetInnerHTML={{ __html: data.data }} />
                </div>
            </div>
        </div>
    )
}

export { Footer };
