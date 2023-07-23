(function () {

    document.addEventListener("DOMContentLoaded", function () {

        // Listen for the click event on the "+" button with id "addPic"
        document.getElementById("addPic").addEventListener("click", function () {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*"; // Allow only image files
            fileInput.style.display = "none";

            // Trigger the file input click event programmatically
            fileInput.click();

            // Listen for the change event on the file input
            fileInput.addEventListener("change", play.handleImageSelection);
        });
    })

    const play = function () {

        const images = {};

        function handleImageSelection(event) {
            const fileInput = event.target;
            const file = fileInput.files[0];

            const imgPreview = document.createElement("img");
            const imageId = Date.now().toString(); // Generate a unique identifier using the current timestamp
            images[imageId] = imgPreview; // Store the image element in the images object
            imgPreview.src = URL.createObjectURL(file);

            // Set random left and top positions within the rectangle
            const rectangle = document.querySelector(".rectangle");
            const rectangleWidth = rectangle.offsetWidth;
            const rectangleHeight = rectangle.offsetHeight;
            const imgWidth = 100; // You can adjust this width as needed
            const imgHeight = 100; // You can adjust this height as needed

            const randomLeft = Math.floor(Math.random() * (rectangleWidth - imgWidth));
            const randomTop = Math.floor(Math.random() * (rectangleHeight - imgHeight));
            imgPreview.style.position = "absolute";
            imgPreview.style.left = `${randomLeft}px`;
            imgPreview.style.top = `${randomTop}px`;
            imgPreview.style.maxWidth = "100px";
            imgPreview.style.maxHeight = "100px";

            // Set the unique identifier as a data attribute for the image element
            imgPreview.setAttribute("data-image-id", imageId);

            rectangle.appendChild(imgPreview);

            imgPreview.addEventListener("click", function () {
                focusImage(imageId);
            });
        }
        // Function to focus the image for keyboard control
        function focusImage(imageId) {
            focusedImageId = imageId;

            // Add keyboard control for moving the focused image
            document.addEventListener("keydown", handleArrowKey);
        }

        // Function to handle arrow key movement
        function handleArrowKey(event) {
            if (focusedImageId) {
                const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
                const moveDistance = 5; // You can adjust the move distance as needed

                if (arrowKeys.includes(event.key)) {
                    event.preventDefault();

                    let deltaX = 0;
                    let deltaY = 0;

                    if (event.key === "ArrowUp") deltaY = -moveDistance;
                    if (event.key === "ArrowDown") deltaY = moveDistance;
                    if (event.key === "ArrowLeft") deltaX = -moveDistance;
                    if (event.key === "ArrowRight") deltaX = moveDistance;

                    const focusedImage = images[focusedImageId];
                    const imageRect = focusedImage.getBoundingClientRect();
                    const currentLeft = parseFloat(focusedImage.style.left);
                    const currentTop = parseFloat(focusedImage.style.top);
                    const rectangleRect = document.querySelector(".rectangle").getBoundingClientRect();

                    // Calculate the new position
                    const newLeft = currentLeft + deltaX;
                    const newTop = currentTop + deltaY;

                    // Calculate the boundaries of the rectangle relative to the window
                    const minX = rectangleRect.left + window.pageXOffset;
                    const maxX = rectangleRect.right - imageRect.width + window.pageXOffset;
                    const minY = rectangleRect.top + window.pageYOffset;
                    const maxY = rectangleRect.bottom - imageRect.height + window.pageYOffset;

                    // Check if the new position exceeds the rectangle boundaries
                    const constrainedLeft = Math.min(Math.max(newLeft, minX), maxX);
                    const constrainedTop = Math.min(Math.max(newTop, minY), maxY);

                    // Apply the transformation
                    focusedImage.style.left = `${constrainedLeft}px`;
                    focusedImage.style.top = `${constrainedTop}px`;
                }
            }
        }

        return {
            handleImageSelection: handleImageSelection
        }

    }();

})();





