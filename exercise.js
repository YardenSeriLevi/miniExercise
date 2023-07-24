(function () {

    const RECTANGLE_HEIGHT = 300;
    const RECTANGLE_WIDTH = 500;
    const IMAGE_HEIGHT = 50;
    const IMAGE_WIDTH = 50;
    const OFFSET = 5;

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

        let focusedImageId;

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
            const imgWidth = 100;
            const imgHeight = 100;

            const randomLeft = Math.floor(Math.random() * (rectangleWidth - imgWidth));
            const randomTop = Math.floor(Math.random() * (rectangleHeight - imgHeight));
            imgPreview.style.position = "absolute";
            imgPreview.style.left = `${randomLeft}px`;
            imgPreview.style.top = `${randomTop}px`;
            imgPreview.style.width = "50px"; // Set the width explicitly to 100 pixels
            imgPreview.style.height = "50px"; // Set the height explicitly to 100 pixels
            imgPreview.style.objectFit = "cover"; // Ensure the image fits without distortion
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

            // Remove the "selected-image" class from any previously focused image
            const prevSelectedImage = document.querySelector(".selected-image");
            if (prevSelectedImage) {
                prevSelectedImage.classList.remove("selected-image");
            }

            // Add the "selected-image" class to the currently focused image
            const focusedImage = images[focusedImageId];
            focusedImage.classList.add("selected-image");

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


                    const focusedImage = images[focusedImageId];
                    const imageRect = focusedImage.getBoundingClientRect();
                    const currentLeft = parseFloat(focusedImage.style.left);
                    const currentTop = parseFloat(focusedImage.style.top);
                    const rectangleRect = document.querySelector(".rectangle").getBoundingClientRect();

                    console.log("rectangleRect.top " + rectangleRect.top);
                    console.log("rectangleRect.left " + rectangleRect.left);
                    console.log("imageRect.top " + imageRect.top);
                    console.log("imageRect.left " + imageRect.left);

                    if (event.key === "ArrowUp")
                        if (imageRect.top - moveDistance > rectangleRect.top + OFFSET) deltaY = -moveDistance;

                    if (event.key === "ArrowDown")
                        if(imageRect.top + moveDistance < rectangleRect.top + RECTANGLE_HEIGHT - IMAGE_HEIGHT - OFFSET)
                            deltaY = moveDistance;

                    if (event.key === "ArrowLeft")
                        if(imageRect.left - moveDistance  > rectangleRect.left + OFFSET ) deltaX = -moveDistance;

                    if (event.key === "ArrowRight")
                        if(imageRect.left + moveDistance  < rectangleRect.left + RECTANGLE_WIDTH - IMAGE_WIDTH - OFFSET)
                            deltaX = moveDistance;

                    // Calculate the new position
                    const newLeft = currentLeft + deltaX;
                    const newTop = currentTop + deltaY;

                    // Apply the transformation
                    focusedImage.style.left = `${newLeft}px`;
                    focusedImage.style.top = `${newTop}px`;
                }
            }
        }

        return {
            handleImageSelection: handleImageSelection
        }

    }();

})();





